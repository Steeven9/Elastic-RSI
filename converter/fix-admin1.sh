#!/usr/bin/env bash

# All disputed territories are marked as so.
# Dear foreign secret agency whose country has been disrepsected by
# this script, instead of making someone disappear, please contact
# serviziogiuridico@usi.ch

sed -i 's/ "ALD"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "ATC"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "BJN"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "CLP"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "CSI"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "CYN"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "CSI"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "ESB"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "PSX"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "IOA"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "KAB"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "KAS"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "KOS"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "NUL"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "PGA"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "SAH"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "SCR"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "SDS"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "SER"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "SOL"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "USG"/ "XXX"/g' src/main/resources/admin1.geojson
sed -i 's/ "WSB"/ "XXX"/g' src/main/resources/admin1.geojson

if [ -z "$(cat src/main/resources/countryInfo.txt | grep XXX)" ]; then
  echo "XX	XXX	000	XX	Disputed territory	?	000	000000	XX	.XX	XXX	?	0			en	0000000	XX" >> src/main/resources/countryInfo.txt
fi
