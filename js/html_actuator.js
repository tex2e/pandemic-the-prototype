function HTMLActuator(color) {
  this.tileContainer        = document.querySelector(".tile-container");
  this.messageContainer     = document.querySelector(".game-message");
  this.tileRemovedContainer = document.querySelector(".tile-removed-container");
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    // Clear tile container
    while (self.tileContainer.firstChild) {
      self.tileContainer.removeChild(self.tileContainer.firstChild);
    }

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    grid.cells.forEach(function (column) {
      column.forEach(function (tile) {
        if (tile && tile.pack) {
          grid.removeTile(tile); // update grid
          self.removeTile(tile); // animate
        }
      });
    });

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }
  });
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.cssPositionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile"];
  if (tile.syringe) {
    classes.push("tile-" + tile.cssType + "-syringe");
  } else if (tile.pack) {
    classes.push("tile-" + tile.cssType + "-pack");
  } else {
    classes.push("tile-" + tile.cssType + "-" + tile.value);
  }
  classes.push(positionClass);
  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  // inner.textContent = tile.value;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.cssPositionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.cssPositionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};

HTMLActuator.prototype.removeTile = function (pos) {
  $(".tile-container").find("." + this.cssPositionClass(pos)).each(function(index, elem) {
    if ($(elem).hasClass("tile-merged")) {
      $(elem).appendTo(".tile-removed-container");
    } else {
      $(elem).animate({ opacity: 0 }, 500).promise().then(function () { $(this).remove() })
    }
  });

  $(".tile-removed-container .tile").each(function(index, elem) {
    $(elem).css({ zIndex: "100", position: "fixed" })
    $(elem).animate({ top: 0 }, 1000).animate({ opacity: 0 }, 300).promise().then(function () { $(this).remove() })
  })
};
