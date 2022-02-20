# embedded-system
For Embedded System subject

## Development install
```
git clone https://github.com/tpw284/physiotherapy-medical.git

cd physiotherapy-medical

#Install all dependencies(from root folder)
yarn
```

## Development configs
- Run `yarn` or `npm install` at root folder to install all dependencies 
- Run `yarn` or `npm install` at `coreui-free-react-admin-template` folder to install all dependencies 

## Run development 
- Run `SERVER`:
  - At root folder run: 
  ```
  yarn dev
  ```
- Run `CLIENT`:
  - At `./coreui-free-react-admin-template` run: 
  ```
  yarn start
  ```
- Open `localhost:3000`

##MQTT Topic
- `MANDevices/Roof_Garden/Node_1_Environment/Temperature`
- `MANDevices/Roof_Garden/Node_1_Environment/Humidity`
- `MANDevices/Roof_Garden/Node_2_Environment/Temperature` 
- `MANDevices/Roof_Garden/Node_2_Environment/Humidity`
- `MANDevices/Roof_Garden/Dirt_Environment/Humidity`
- `MANDevices/Roof_Garden/Device_Power/LipoBatt`
- `MANDevices/Roof_Garden/Device_Power/Solar`  
