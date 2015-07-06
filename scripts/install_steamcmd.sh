SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
BASE_DIR="$( cd $SCRIPT_DIR && cd .. && pwd)"
STEAMCMD_DIR="$BASE_DIR/steamcmd"
UNAMESTR=`uname`

mkdir -p $STEAMCMD_DIR

if [[ "$UNAMESTR" == 'Linux' ]]; then
  wget "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz" -O "$STEAMCMD_DIR/steamcmd.tar.gz"
elif [[ "$UNAMESTR" == 'Darwin' ]]; then # os x
  curl -o "$STEAMCMD_DIR/steamcmd.tar.gz" "https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz"
fi


tar -zxvf "$STEAMCMD_DIR/steamcmd.tar.gz" -C $STEAMCMD_DIR
rm "$STEAMCMD_DIR/steamcmd.tar.gz"
chmod +x "$STEAMCMD_DIR/steamcmd.sh"
# chmod +x "$STEAMCMD_DIR/steam.sh"
