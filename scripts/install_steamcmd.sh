SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
BASE_DIR="$( cd $SCRIPT_DIR && cd .. && pwd)"
STEAMCMD_DIR="$BASE_DIR/steamcmd"

if [ ! -f "$STEAMCMD_DIR/steamcmd.sh" ]; then
  wget "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz" -O "$STEAMCMD_DIR/steamcmd.tar.gz"
  tar -zxvf "$STEAMCMD_DIR/steamcmd.tar.gz" -C $STEAMCMD_DIR
  rm "$STEAMCMD_DIR/steamcmd.tar.gz"
  chmod +x "$STEAMCMD_DIR/steamcmd.sh"
  chmod +x "$STEAMCMD_DIR/steam.sh"
  echo "successfully installed steamcmd"
else
  echo "steamcmd is already installed"
fi
