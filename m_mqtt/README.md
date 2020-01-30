# m-mqtt

## `agent/connected`

```js
{
  agent: {
    uuid, // auto
      username, // configuracion
      name, // configuracion
      hostname, // obtener del OS
      pid; // obtener del proceso
  }
}
```

## `agent/disconnected`

```js
{
  agent: {
    uuid, // auto
  }
}
```

## `agent/meesage`

```js
{
  agent: {
    uuid, // auto
      username, // configuracion
      name, // configuracion
      hostname, // obtener del OS
      pid; // obtener del proceso
  },
  metrics : [
      {
          type,
          value
      }
  ],
  timestamp // se genera al momento que creamos el mensaje
}
```
