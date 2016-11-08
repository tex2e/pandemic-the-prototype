function Tile(position, value, type) {
  this.x     = position.x;
  this.y     = position.y;
  this.value = value || 2;

  if (type) {
    this.type    = type;
    this.cssType = GameManager.cssColorMap[type];
  } else {
    var num = Utils.rand(3);
    this.type    = GameManager.colors[num];
    this.cssType = GameManager.cssColors[num];
  }

  this.previousPosition = null;
  this.mergedFrom       = null; // Tracks tiles that merged together
}

Tile.typeList = ['pink', 'lightblue', 'yellow', 'lightgreen'];

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};

Tile.prototype.serialize = function () {
  return {
    position: {
      x: this.x,
      y: this.y
    },
    value: this.value,
    type: this.type,
  };
};
