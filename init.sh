#! /bin/bash

read -p "environment(prod/dev): " environment

if [ ${environment} != "prod" ] && [ ${environment} != 'dev' ] ; then
  echo "environment: please enter only prod/dev"
  exit
fi

read -p "build(y/n): " build


if [ ${build} == "y" ] ; then
  docker-compose -f docker-compose.yml -f docker-compose.${environment}.yml up -d --build && docker volume prune -f && docker image prune -f
elif [ ${build} == "n" ] ; then
  docker-compose -f docker-compose.yml -f docker-compose.${environment}.yml up -d && docker volume prune -f
else
  echo "build: please enter only y/n"
  exit
fi

RETRY=10

while [ $RETRY -gt 0 ]
do
  if docker exec -it nosql nodetool status ; then
    echo 'cassandra started'
    docker exec -it nosql cqlsh -e "CREATE KEYSPACE IF NOT EXISTS test WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};"
    docker exec -it nosql cqlsh -e "CREATE TABLE IF NOT EXISTS test.memos (user_id text, memo text, create_date timestamp, PRIMARY KEY (user_id, create_date)) WITH CLUSTERING ORDER BY (create_date DESC);"
    break
  else
    echo "retrying" >&2

    let RETRY-=1
    sleep 10
  fi
done