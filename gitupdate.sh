#!/bin/bash
git push origin master
ssh edo@lilik.it 'cd public_html/testremotegit/exploding-points-html5/ && git pull'
