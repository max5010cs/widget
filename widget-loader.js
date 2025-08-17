(function() {
  if (window.MyChatWidgetLoaded) return;
  var s = document.createElement('script');
  s.src = 'https://your-vercel-app.vercel.app/widget.js';
  s.async = true;
  document.head.appendChild(s);
})();
