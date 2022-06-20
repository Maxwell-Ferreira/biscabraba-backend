const loadView = (viewName, callback) => {
  $("#main").load(`views/${viewName}.html`, callback);
}

const sound = (name) => {
  const audio = new Audio('audio/' + name);
  audio.play();
  return audio;
}