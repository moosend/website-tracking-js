# Tracker API usage example

## Initialization
The tracker client should be initialized before it can be used.

```javascript
// Call it before any other calls to API
_moo.init({ siteId: 'condiva.com.ID' })
```

**Any attempts to use lib without initialization will result in warning in the console. NO actions will be made.**

## Identify

```javascript
// Identify
_moo.identify({ email: 'me@nowhere.com' });

// Payload
// {
//     "email": "me@nowhere.com",
//     "userId": "46b274d6-69eb-4906-a102-5e1bd5284278",
//     "siteId": "a",
//     "sessionNumber": "1"
// }

// Identify with name
_moo.identify({ email: 'me@nowhere.com', name: 'me' });

// Payload
// {
//     "email": "me@nowhere.com",
//     "userId": "df53acbb-eb03-47ea-b3fa-a3aca0856c00",
//     "siteId": "a",
//     "sessionNumber": "1",
//     "name": "me"
// }

// Identify with additional props
_moo.identify({ email: 'me@nowhere.com', properties: { customFieldNumber: 1, customFieldStr: 'asdasd' } });
// Payload
// {
//     "email": "me@nowhere.com",
//     "userId": "e5d0fbf3-92a1-408b-b8da-1f349c90b305",
//     "siteId": "a",
//     "sessionNumber": "1",
//     "properties": {
//         "customFieldNumber": 1,
//         "customFieldStr": "asdasd"
//     }
// }
```

## Send track events

### Add item to order

```javascript
// Add item
_moo.track('ADD_TO_ORDER', {
  "itemCode": "newone",
  "itemPrice": 99.1
});

// Payload
// {
//     "actionType": "ADD_TO_ORDER",
//     "userId": "e5d0fbf3-92a1-408b-b8da-1f349c90b305",
//     "siteId": "a",
//     "session": {
//         "number": "1",
//         "language": "en-US"
//     },
//     "email": "me@nowhere.com",
//     "properties": {
//         "itemCode": "newone",
//         "itemPrice": 99.1
//     }
// }

// Add item with additional props
_moo.track('ADD_TO_ORDER', {
  "custom-prop3": "custom value",
  "itemCode": "asdas",
  "itemPrice": 13
});

// Payload
// {
//     "actionType": "ADD_TO_ORDER",
//     "userId": "e5d0fbf3-92a1-408b-b8da-1f349c90b305",
//     "siteId": "a",
//     "session": {
//         "number": "1",
//         "language": "en-US"
//     },
//     "email": "me@nowhere.com",
//     "properties": {
//         "custom-prop3": "custom value",
//         "itemCode": "asdas",
//         "itemPrice": 13
//     }
// }
```

### Complete current order
There must be at least one item added to an order, before it can be completed.

```javascript
// Complete order
_moo.track('ORDER_COMPLETED');

// Payload
// {
//     "actionType": "ORDER_COMPLETED",
//     "userId": "e5d0fbf3-92a1-408b-b8da-1f349c90b305",
//     "siteId": "a",
//     "session": {
//         "number": "1",
//         "language": "en-US"
//     },
//     "email": "me@nowhere.com"
// }

// Complete order with additional props
_moo.track('ORDER_COMPLETED', { myprops: 'i am custom, man!' });

// Payload
// {
//     "actionType": "ORDER_COMPLETED",
//     "userId": "e5d0fbf3-92a1-408b-b8da-1f349c90b305",
//     "siteId": "a",
//     "session": {
//         "number": "1",
//         "language": "en-US"
//     },
//     "email": "me@nowhere.com",
//     "properties": {
//         "myprops": "i am custom, man!"
//     }
// }
```
