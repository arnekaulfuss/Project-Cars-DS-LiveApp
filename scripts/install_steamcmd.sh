SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
BASE_DIR="$( cd $SCRIPT_DIR && cd .. && pwd)"
HOME_DIR="$( cd ~ && pwd )"
STEAMCMD_DIR="$HOME_DIR/steamcmd"

if [ ! -f "$STEAMCMD_DIR" ]; then
  mkdir -p "$STEAMCMD_DIR"
fi

if [ ! -f "$STEAMCMD_DIR/steamcmd.sh" ]; then
  wget "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz" -O "$STEAMCMD_DIR/steamcmd.tar.gz"
  tar -zxvf "$STEAMCMD_DIR/steamcmd.tar.gz" -C $STEAMCMD_DIR
  rm "$STEAMCMD_DIR/steamcmd.tar.gz"
  chmod +x "$STEAMCMD_DIR/steamcmd.sh"
  chmod +x "$STEAMCMD_DIR/steam.sh"

  if [ -f "$BASE_DIR/steamcmd" ]; then
    unlink "$BASE_DIR/steamcmd"
  fi

  ln -s "$STEAMCMD_DIR" "$BASE_DIR/steamcmd"
  echo "successfully installed steamcmd to home directory"
else
  echo "steamcmd is already installed"
fi
