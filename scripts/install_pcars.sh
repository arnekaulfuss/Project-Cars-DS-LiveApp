SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
BASEDIR="$( cd $SCRIPT_DIR && cd .. && pwd)"
STEAMCMD_DIR="$BASEDIR/steamcmd"
export CPU_MHZ=3000 # fix for some virtualmachines

"$STEAMCMD_DIR/steamcmd.sh" +login anonymous +force_install_dir "$STEAMCMD_DIR/pcars_ds" +app_update 332670 validate +exit
echo $STEAMCMD_DIR
cp -R "$STEAMCMD_DIR/linux32/"* "$STEAMCMD_DIR/pcars_ds/lib32/"