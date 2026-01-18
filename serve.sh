#!/usr/bin/env bash
# serve.sh - start local static server (Python) bound to localhost and print URL
# Usage: ./serve.sh [PORT] [--bind IP] [--bg|-b] [--open|-o]

# defaults
PORT=8000
BIND=127.0.0.1
BG=0
OPEN=0

# simple arg parse
while [[ $# -gt 0 ]]; do
  case "$1" in
    -b|--bg)
      BG=1; shift ;;
    -o|--open)
      OPEN=1; shift ;;
    --bind)
      BIND="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: $0 [PORT] [--bind IP] [--bg|-b] [--open|-o]"; exit 0 ;;
    -* )
      echo "Unknown option: $1"; exit 1 ;;
    *)
      # first non-option is port
      if [ -z "${PORT_GIVEN}" ]; then
        PORT="$1"; PORT_GIVEN=1; shift
      else
        shift
      fi
      ;;
  esac
done

# Try to kill any existing process listening on this port
existing_pid=$(lsof -tiTCP:${PORT} -sTCP:LISTEN -nP)
if [ -n "$existing_pid" ]; then
  echo "Killing existing process on port ${PORT}: $existing_pid"
  kill "$existing_pid" 2>/dev/null || true
  sleep 0.3
fi

URL="http://${BIND}:${PORT}/"
if [ "$BG" -eq 1 ]; then
  echo "Starting Python static server in background on ${URL} (bound to ${BIND})"
  # nohup + disown so it keeps running after the terminal closes
  nohup python3 -m http.server "$PORT" --bind "$BIND" > ./serve.log 2>&1 &
  pid=$!
  disown $pid 2>/dev/null || true
  echo "Server started (PID: $pid). Logs: ./serve.log"
  if [ "$OPEN" -eq 1 ]; then
    # macOS `open` will open the URL in the default browser
    if command -v open >/dev/null 2>&1; then
      open "$URL" || true
    fi
  fi
else
  echo "Starting Python static server on ${URL} (bound to ${BIND})"
  python3 -m http.server "$PORT" --bind "$BIND"
fi

# Note: run `chmod +x serve.sh` once to make it executable.
