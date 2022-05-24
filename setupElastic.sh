sudo chmod 777 certs
sudo chown -R root:root certs

docker-compose up -d

source ./exportEnv.sh

curl -X POST -u elastic:${ELASTIC_PASSWORD} \
http://localhost:9200/_security/user/kibana_system/_password \
-H "Content-Type: application/json" \
-d "{\"password\":\"${KIBANA_PASSWORD}\"}" \

docker restart kibana

docker exec elasticsearch bin/elasticsearch-certutil ca --pem -out config/certs/ca.zip
docker exec elasticsearch unzip config/certs/ca.zip -d config/certs
docker exec elasticsearch bin/elasticsearch-certutil cert --pem -out config/certs/certs.zip --in config/certs/instances.yml --ca-cert config/certs/ca/ca.crt --ca-key config/certs/ca/ca.key
docker exec elasticsearch unzip config/certs/certs.zip -d config/certs
