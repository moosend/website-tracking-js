<p align="center">   
  <a target="_blank" href="https://www.moosend.com/"><img width="250" class="logo" alt="moosend" src="https://moosend.com/wp-content/themes/moosend_theme/images/moosend_logo_full.svg" scale="0"></a>    
</p>    

<p align="center">    
  <a href="https://travis-ci.org/moosend/website-tracking-js"><img src="https://travis-ci.org/moosend/website-tracking-js.svg" alt="Build Status"></a>    
  <a href="https://www.npmjs.com/package/mootracker"><img src="https://badge.fury.io/js/mootracker.svg" alt="Latest Stable Version"></a>    
  <a href="https://www.npmjs.com/package/mootracker"><img src="https://poser.pugx.org/moosend/tracker/license.svg" alt="License"></a>   
</p>
#Global NPM packages
  npm install typescript@1.5.0-alpha -g

#Local NPM packages
  npm install

#NPM scripts
  ##Test
    To run tests first compile sources with npm script
      npm run build-watch-tests
    or directly
      tsc --noImplicitAny --outDir compiled/ --module commonjs test/*.test.ts --watch -t es5

    Then run tests
      npm test

  ##Demo
    Demo consists of express server that serves to hosts. To run the demo you need
    1. Add aliases to your hosts file
      127.0.0.1 local.tracker.domain
      127.0.0.1 local.client.domain
    2. Bundle demo
      npm run bundle-demo
    3. Start demo server
      npm run demo
    4. Open browser at http://local.client.domain

  ##Bundle
    You can bundle js sources with npm script (that will produce dist/bundle.js)
      npm run bundle
    And you can bundle minified version (that will produce dist/bundle.min.js)
      npm run bundle-min


#Tracker API
moo.identify({ email: string, name?: string });
moo.track(action: string, { key: value });
moo.track(action: string, [{ key1: value1 }, { key2: value2 }]);

moo.trackLogin(); // Will send LOGIN event with no context
moo.trackPageView(); // Will send PAGE_VIEW event with { url: string }

// Events known on server side

// Will add item to order or increase the item count if already in order.
// If there is no STARTED order it will be created
moo.track('ADD_TO_ORDER', [{ itemCode: string }, { itemPrice: number }]);

// Will remove currently STARTED order and insert COMPLETED order
moo.track('ORDER_COMPLETED')
