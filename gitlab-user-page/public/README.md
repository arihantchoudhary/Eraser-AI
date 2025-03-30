# 3D Torus Fractal Background

This package contains a 3D torus fractal animation that you can use as a background for your website.

## Contents

1. `index.html` - A complete demo showing how to use the fractal background
2. `TorusFractalBackground.js` - A modular version you can import into your project

## How to Use

### Option 1: Copy the HTML Demo

The simplest way to get started is to copy the HTML from the `index.html` file and modify it to suit your needs. This contains everything you need in a self-contained file.

### Option 2: Use the JS Module in Your Project

If you're using a build system or modern JS framework:

1. Copy `TorusFractalBackground.js` to your project
2. Install Three.js if you don't have it: `npm install three`
3. Import and use the module:

```javascript
import TorusFractalBackground from './path/to/TorusFractalBackground';

// Create a container element
const container = document.getElementById('fractal-container');

// Initialize the background
const background = new TorusFractalBackground(container);
```

4. Add CSS to position the container:

```css
#fractal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
```

## Customization Options

You can customize the fractal by modifying these parameters in the code:

- Colors: Change the `DEPTH_COLORS` array
- Size: Modify the `radius` and `tubeRadius` parameters
- Depth: Change the depth parameter (4 is default)
- Rotation speed: Adjust the rotation multipliers in the animate function
- Wireframe density: Change the resolution of the torus geometry

## Browser Compatibility

This should work in all modern browsers that support WebGL:
- Chrome 9+
- Firefox 4+
- Safari 5.1+
- Edge 12+
- Opera 12+

## Performance Considerations

The fractal can be CPU intensive. If you experience performance issues:
- Reduce the depth (3 instead of 4)
- Lower the geometry resolution (first two numbers in TorusGeometry)
- Limit the number of visible tori

## Credits

This torus fractal animation was created using Three.js.
