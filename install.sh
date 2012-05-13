VERSION=4.1.0

mkdir $PWD/src
cd $PWD/src/
wget "http://cdn.sencha.io/ext-$VERSION-gpl.zip"
unzip ext-$VERSION-gpl.zip
mv $PWD/extjs-$VERSION ext
