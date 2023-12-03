# EV-Route-Planner
## Problem Statement
Finding charging stations can be challenging when planning long distance EV journeys, and this makes it difficult to identify the most efficient route, which can make users experience range anxiety.

Customers' reasons for hesitating to buy an EV  :
* Extensive charging time
* Limited-range
* Lack of EV charging infrastructure

## Objective:
Build a website that suggests the most optimal path that the EV can take through charging stations, so that it can reach its destination the fastest without running out of charge.

## Assumptions:
* All EV drivers will be using the website to book charging station sessions.
* EV gets a full charge at each station stop.
* Battery charge consumed is only proportional to the distance travelled by EV and is immune to other external factors.
* We have location of all the charging station.
* We have real time info about the location of the EV.
* We know the real time traffic conditions of the roads.
* We know the car model of the EVs.
* EV has constant battery discharge rate for when it is stationary
* Charging station has only one port.

## Design Overview:
![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/1cef8666-9153-4549-939e-b1e175bd02ed)

## Polyline Implementation:
![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/af97c0e2-f624-457e-8245-46c0606ce916)

## Results:
* Website UI
![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/577c9fcf-18c3-4d00-9207-1abe693d8230)

&nbsp;

* EV can't reach its destination since the distance between start and end point is beyond EV's max range and also as there are no EV charging stations withing the max range radius of the EV's starting point.
![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/3915e0db-fd70-4201-aea6-920330b73b47)

&nbsp;

* The start point is Borivali, Mumbai and end point is Dahisar East, Mumbai with a battery capacity of 2500. Path computed between 2 points. Since the distance between the 2 points is less than the max range of EV, the EV doesn't need to recharge at any charging station during the journey
![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/9edcf13f-b61f-4fd9-ba50-0ffa3b5d4005)
&nbsp;

* Path computed between 2 points. Since the distance between the 2 points is greater than the max range of EV, the EV needs to stop at a charging station to recharge.
![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/252e7aa7-e13e-40bd-becc-a807831f3d34)
&nbsp;

* Started the simulation of the EV moving along the computed path. The EV is moving in proportion to the real time traffic conditions. The frame rate can be adjusted. We can see the current speed is 30 kmph and current charge percentage is 78.64% 
![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/5c4c7102-7305-4c25-a56b-a2d68591446a)
&nbsp;

* EV has reached the charging station. We can see the current charge percentage is 32.39%. We can choose to recharge right now, in which case we will need to add to the charging queue at the station.
![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/5445e74b-2e26-4d9e-81f0-27093de44c97)
&nbsp;

* In CASE 1, we choose to not recharge, and thus we are not able to reach the destination since we ran out of charge.
![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/d9a47c5d-aded-4001-8a18-cb9c4b3eec6a)
&nbsp;

* In CASE 2, we choose to recharge, and thus add ourself to the queue. We can see our waiting time in the queue is 1m 35s.
![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/ab02452b-a6be-4f13-9069-a3bb589a1012)
&nbsp;

* Now after waiting, the station is finally free. We can start charging now.
  ![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/6cea0802-66db-4073-83af-81d0d2f316e8)
&nbsp;

* We are charging the EV right now. We can see charging completion is 89%.
  ![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/572ebaf7-1be6-43b8-9a9b-4d5f72d55cc6)
&nbsp;

* Charging is complete!
![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/bfca9cdb-706f-437a-88b0-9c295a2f39a6)
&nbsp;

* We are now moving along the computed path after charging
![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/d45cdead-0b6e-44bb-a7a7-c05c8d6c5890)
&nbsp;

* Now after charging, we can easily reach the destination without running out of charge
![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/1817083a-3b3f-44d6-977b-612247c3a738)

&nbsp;

* Here, we have kept all the parameters such as start and end points as well as battery capacity the same, but we have computed a different path. This is because of dynamic traffic conditions as well as dynamic waiting time at charging stations
![image](https://github.com/Amogh-Nivaskar/EV-Route-Planner/assets/99811918/7b106749-a83b-4a72-a1b0-cd13e3ceebd9)














