
# Table of contents

- [Table of contents](#table-of-contents)
- [How to use](#how-to-use)
  - [Example 1 - Easy way](#example-1---easy-way)
  - [Example 2](#example-2)
  - [Example 3](#example-3)
  - [Example 4](#example-4)



# How to use

## Example 1 - Easy way

```ts
import { expressCors } from 'express-cors-ts';
import express, { Request, Response } from 'express';


const app = express();

app.use(expressCors()); // allow all origins
// or 
app.use(expressCors({
    allowedOrigins: "*" // allow all origins
}));

```


## Example 2

```ts
import { expressCors } from 'express-cors-ts';
import express, { Request, Response } from 'express';


const app = express();


app.use(expressCors({
    allowedOrigins: [
        'domain1.com', // Allow all from domain1.com with default configurations
        'domain2.com',
        '127.0.0.1', // Allow all from 127.0.0.1 with default configurations
        'localhost'
    ]
}));

```



## Example 3

```ts
import { expressCors } from 'express-cors-ts';
import express, { Request, Response } from 'express';


const app = express();


app.use(expressCors({
    allowedOrigins: [
        'domain1.com', // Allow all with default configurations
        {
            hostnames: 'bookstore.com',
            allowMethods: 'GET',
        },
        {
            hostnames: 'admin-bookstore.com',
            ports: '*', // Allow all ports
            protocols: '*' // Allow all protocols
            allowMethods: '*', // Allow all methods
        },
        {
            hostnames: [ 'admin-my-blog.com', 'my-blog.com' ],
            ports: [ 80, 3000, 443, 8080 ],
            protocols: 'http',
            allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
            allowHeaders: [ 'Origin', 'X-Requested-With', 'Content-Type', 'Auth', 'Authorization' ],
            exposeHeaders: [ 'Token' ],
            allowCredentials: true,
        }
    ],
    otherOrigins: 'no-action' // Set action when origin does not exist in allowOrigins.
}));


```



## Example 4

```ts
import { expressCors } from 'express-cors-ts';
import express, { Request, Response } from 'express';


const allows:AllowedOrigin[] = [
    'domain1.com',
    {
        hostnames: 'bookstore.com',
        allowMethods: 'GET',
    },
    {
        hostnames: 'admin-bookstore.com',
        allowMethods: '*',
        ports: '*',
        protocols: '*'
    },
];

const app = express();

app.use(expressCors({
    allowedOrigins: allows,
    
    otherOrigins: (req:Request, res:Response, next:NextFunction) => {
        // Your code here ...
        next();
    }
}));


```