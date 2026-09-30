#!/usr/bin/env python3
"""
=============================================================================
Flipkart Sentiment Analysis - Unified Project Runner
=============================================================================
Runs both the FastAPI Backend and Vite/React Frontend concurrently from a single
command:
    python run.py

Key Features:
- Starts FastAPI (Uvicorn) and React (Vite) concurrently in real-time.
- Color-coded real-time log streaming with prefixes ([BACKEND] & [FRONTEND]).
- Automatic dependency verification for Python and Node.js.
- Clean shutdown on Ctrl+C (terminates both process trees cleanly on Windows & Linux).
- Optional CLI arguments: --open, --backend-only, --frontend-only, --port-backend, etc.
=============================================================================
"""

import os
import sys
import time
import shutil
import signal
import threading
import subprocess
import argparse
import webbrowser
from pathlib import Path

# Ensure UTF-8 output encoding on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Enable ANSI color escape codes on Windows consoles
if sys.platform == "win32":
    os.system("")

# ANSI Color Codes
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
DIM = "\033[2m"
RESET = "\033[0m"

PROJECT_ROOT = Path(__file__).resolve().parent
BACKEND_DIR = PROJECT_ROOT / "backend"
FRONTEND_DIR = PROJECT_ROOT / "frontend"

running_processes = []
shutdown_initiated = False


def log_system(msg: str):
    print(f"{YELLOW}{BOLD}[SYSTEM]{RESET} {msg}", flush=True)


def log_error(msg: str):
    print(f"{RED}{BOLD}[ERROR]{RESET} {msg}", flush=True)


def stream_pipe(pipe, tag: str, color: str):
    """Streams output from a subprocess pipe line by line with colored prefix."""
    try:
        for line in iter(pipe.readline, ""):
            if not line:
                break
            stripped = line.rstrip("\r\n")
            if stripped:
                print(f"{color}{tag}{RESET} {stripped}", flush=True)
    except Exception:
        pass
    finally:
        try:
            pipe.close()
        except Exception:
            pass


def check_prerequisites(run_backend: bool, run_frontend: bool) -> bool:
    """Verifies that Python and Node environments have necessary tools installed."""
    all_ok = True

    if run_backend:
        if not BACKEND_DIR.exists():
            log_error(f"Backend directory not found at: {BACKEND_DIR}")
            all_ok = False
        else:
            try:
                import fastapi  # noqa: F401
                import uvicorn  # noqa: F401
            except ImportError as e:
                log_error(f"Missing Python dependency ({e.name}). Run: pip install -r backend/requirements.txt")
                all_ok = False

    if run_frontend:
        if not FRONTEND_DIR.exists():
            log_error(f"Frontend directory not found at: {FRONTEND_DIR}")
            all_ok = False
        else:
            npm_cmd = shutil.which("npm.cmd") if sys.platform == "win32" else shutil.which("npm")
            if not npm_cmd:
                log_error("npm was not found in PATH. Please install Node.js (https://nodejs.org).")
                all_ok = False
            elif not (FRONTEND_DIR / "node_modules").exists():
                log_system("Installing frontend npm dependencies (first time setup)...")
                res = subprocess.run([npm_cmd, "install"], cwd=str(FRONTEND_DIR), shell=(sys.platform == "win32"))
                if res.returncode != 0:
                    log_error("Failed to run 'npm install' in frontend directory.")
                    all_ok = False

    return all_ok


def terminate_all_processes():
    """Cleanly terminates all child processes and their sub-trees."""
    global shutdown_initiated
    if shutdown_initiated:
        return
    shutdown_initiated = True

    print("\n")
    log_system("Shutting down frontend and backend services...")

    for proc in running_processes:
        if proc and proc.poll() is None:
            try:
                if sys.platform == "win32":
                    # Cleanly kill entire process tree on Windows (avoids zombie node/python processes)
                    subprocess.run(
                        ["taskkill", "/F", "/T", "/PID", str(proc.pid)],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                        check=False,
                    )
                else:
                    proc.terminate()
                    proc.wait(timeout=3)
            except Exception:
                try:
                    proc.kill()
                except Exception:
                    pass

    log_system("All services stopped successfully. Goodbye!")


def signal_handler(signum, frame):
    terminate_all_processes()
    sys.exit(0)


def start_backend(host: str, port: int, reload: bool):
    """Starts the FastAPI application via uvicorn."""
    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "main:app",
        "--host",
        host,
        "--port",
        str(port),
    ]
    if reload:
        cmd.append("--reload")

    # Ensure backend folder is in PYTHONPATH
    env = os.environ.copy()
    env["PYTHONPATH"] = str(BACKEND_DIR) + (os.pathsep + env.get("PYTHONPATH", "") if env.get("PYTHONPATH") else "")

    proc = subprocess.Popen(
        cmd,
        cwd=str(BACKEND_DIR),
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,
        encoding="utf-8",
        errors="replace",
    )
    running_processes.append(proc)

    t_out = threading.Thread(target=stream_pipe, args=(proc.stdout, f"{CYAN}[BACKEND] {RESET}", CYAN), daemon=True)
    t_err = threading.Thread(target=stream_pipe, args=(proc.stderr, f"{CYAN}[BACKEND] {RESET}", CYAN), daemon=True)
    t_out.start()
    t_err.start()
    return proc


def start_frontend():
    """Starts the React Vite frontend server."""
    npm_cmd = shutil.which("npm.cmd") if sys.platform == "win32" else shutil.which("npm")
    if not npm_cmd:
        npm_cmd = "npm"

    # Use 'flipsentiment' script in frontend/package.json
    cmd = [npm_cmd, "run", "flipsentiment"]

    proc = subprocess.Popen(
        cmd,
        cwd=str(FRONTEND_DIR),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,
        shell=(sys.platform == "win32"),
        encoding="utf-8",
        errors="replace",
    )
    running_processes.append(proc)

    t_out = threading.Thread(target=stream_pipe, args=(proc.stdout, f"{GREEN}[FRONTEND]{RESET}", GREEN), daemon=True)
    t_err = threading.Thread(target=stream_pipe, args=(proc.stderr, f"{GREEN}[FRONTEND]{RESET}", GREEN), daemon=True)
    t_out.start()
    t_err.start()
    return proc


def print_banner(backend_url: str, frontend_url: str, run_backend: bool, run_frontend: bool):
    print("=" * 66)
    print(f"{BOLD} >> Flipkart Sentiment Analysis - Unified Project Server{RESET}")
    print("=" * 66)
    if run_backend:
        print(f" {CYAN}* Backend API:{RESET}        {backend_url}")
        print(f" {CYAN}* Swagger Docs:{RESET}       {backend_url}/docs")
    if run_frontend:
        print(f" {GREEN}* Frontend App:{RESET}       {frontend_url}")
    print("=" * 66)
    print(f"{DIM} Press Ctrl+C at any time to gracefully stop all services.{RESET}\n")


def main():
    parser = argparse.ArgumentParser(description="Unified Runner for Flipkart Sentiment Analysis")
    parser.add_argument("--backend-only", action="store_true", help="Launch only FastAPI backend")
    parser.add_argument("--frontend-only", action="store_true", help="Launch only React frontend")
    parser.add_argument("--backend-host", default="127.0.0.1", help="Backend host (default: 127.0.0.1)")
    parser.add_argument("--backend-port", type=int, default=8000, help="Backend port (default: 8000)")
    parser.add_argument("--no-reload", action="store_true", help="Disable backend auto-reload")
    parser.add_argument("--open", action="store_true", help="Automatically open frontend in browser")

    args = parser.parse_args()

    run_backend = not args.frontend_only
    run_frontend = not args.backend_only

    # Register OS interrupt signals for graceful teardown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # Check setup prerequisites
    if not check_prerequisites(run_backend, run_frontend):
        sys.exit(1)

    backend_url = f"http://{args.backend_host}:{args.backend_port}"
    frontend_url = "http://localhost:5173"

    print_banner(backend_url, frontend_url, run_backend, run_frontend)

    backend_proc = None
    frontend_proc = None

    if run_backend:
        log_system(f"Starting FastAPI backend at {backend_url}...")
        backend_proc = start_backend(args.backend_host, args.backend_port, reload=not args.no_reload)

    if run_frontend:
        log_system(f"Starting React/Vite frontend (npm run flipsentiment)...")
        frontend_proc = start_frontend()

    if args.open and run_frontend:
        time.sleep(2)
        webbrowser.open(frontend_url)

    # Keep main thread alive and monitor child processes
    try:
        while True:
            time.sleep(0.5)
            if backend_proc and backend_proc.poll() is not None:
                log_error(f"Backend process terminated unexpectedly (code: {backend_proc.returncode})")
                break
            if frontend_proc and frontend_proc.poll() is not None:
                log_error(f"Frontend process terminated unexpectedly (code: {frontend_proc.returncode})")
                break
    except KeyboardInterrupt:
        pass
    finally:
        terminate_all_processes()


if __name__ == "__main__":
    main()
