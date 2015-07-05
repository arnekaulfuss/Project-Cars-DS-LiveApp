SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
BASEDIR="$( cd $SCRIPT_DIR && cd .. && pwd)"
STEAMCMD_DIR="$BASEDIR/steamcmd"

mkdir -p $STEAMCMD_DIR
wget "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz" -O "$STEAMCMD_DIR/steamcmd.tar.gz"
tar -zxvf "$STEAMCMD_DIR/steamcmd.tar.gz" -C $STEAMCMD_DIR
rm "$STEAMCMD_DIR/steamcmd.tar.gz"
chmod +x "$STEAMCMD_DIR/steamcmd.sh"
chmod +x "$STEAMCMD_DIR/steam.sh"