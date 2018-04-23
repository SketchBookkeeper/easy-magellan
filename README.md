# easy-magellan

Create an instance of position tracking sidebar navigation.

## Basic Sidebar Example
```javascript
var myMagellan = new Magellan('.js-magellan-content', '.js-magellan-link', options);
```

```html
<aside>
  <nav>
    <ul>
      <li><a href="#one" class="js-magellan-link">Link 1</a></li>
      <li><a href="#two" class="js-magellan-link">Link 2</a></li>
      <li><a href="#three" class="js-magellan-link">Link 3</a></li>
    </ul>
  </nav>
</aside>

<main>
  <div id="one" class="some-content js-magellan-content">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>

  <div id="two" class="some-content js-magellan-content">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>

  <div id="three" class="some-content js-magellan-content">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </div>
</main>
```

## Options
Option | Default
--- | ---
activeLinkClass | 'is-active'
intersectionObserverOptions | object

### IntersectionObserverOptions
Exposes options available via the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

Option | Default
--- | ---
root | null
rootMargin | '0px'
threshold | 1
