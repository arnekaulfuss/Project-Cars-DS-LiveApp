SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
BASE_DIR="$( cd $SCRIPT_DIR && cd .. && pwd)"
STEAMCMD_DIR="$BASE_DIR/steamcmd"
export CPU_MHZ=3000 # fix for some virtualmachines

if [ ! -f "$STEAMCMD_DIR/pcars_ds/DedicatedServerCmd" ]; then
  "$STEAMCMD_DIR/steamcmd.sh" +login anonymous +force_install_dir "$STEAMCMD_DIR/pcars_ds" +app_update 332670 validate +exit
  cp -R "$STEAMCMD_DIR/linux32/"* "$STEAMCMD_DIR/pcars_ds/lib32/"
  echo "successfully installed pcars dedicated server"
else
  echo "pcars dedicated server is already installed"
fi
