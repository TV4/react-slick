"use strict";

import React from "react";
import classnames from "classnames";

var getDotCount = function(spec) {
  var dots;

  if (spec.infinite) {
    dots = Math.ceil(spec.slideCount / spec.slidesToScroll);
  } else {
    dots =
      Math.ceil((spec.slideCount - spec.slidesToShow) / spec.slidesToScroll) +
      1;
  }

  return dots;
};

export class Dots extends React.PureComponent {
  clickHandler(options, e) {
    // In Autoplay the focus stays on clicked button even after transition
    // to next slide. That only goes away by click somewhere outside
    e.preventDefault();
    this.props.clickHandler(options);
  }
  render() {
    var dotCount = getDotCount({
      slideCount: this.props.slideCount,
      slidesToScroll: this.props.slidesToScroll,
      slidesToShow: this.props.slidesToShow,
      infinite: this.props.infinite
    });

    // Apply join & split to Array to pre-fill it for IE8
    //
    // Credit: http://stackoverflow.com/a/13735425/1849458
    const { onMouseEnter, onMouseOver, onMouseLeave } = this.props;
    const mouseEvents = { onMouseEnter, onMouseOver, onMouseLeave };
    var dotsTemplate = Array.apply(
      null,
      Array(dotCount + 1)
        .join("0")
        .split("")
    );

    const dotsBounds = dotsTemplate.map((_, i) => {
      const isLast = i === dotsTemplate.length - 1;
      const isFirst = i === 0;
      const isSecond = i === 1;
      if (isLast) {
        return {
          leftBound: this.props.slideCount - this.props.slidesToScroll,
          rightBound: Infinity
        };
      }
      if (isFirst) {
        return {
          leftBound: 0,
          rightBound: 0
        }; // We only want the actually first slidesToScroll items to set first dot to current
      }
      if (isSecond) {
        // Extend second due to isFirst-rules
        return {
          leftBound: 1,
          rightBound: this.props.slidesToScroll
        };
      }
      var leftBound =
        this.props.slideCount -
        (dotsTemplate.length - i) * this.props.slidesToScroll;
      var rightBound = i * this.props.slidesToScroll;
      return { leftBound, rightBound };
    });

    let activeIndex = 0;
    // Make sure only one dot is active. Conflicts might occur, a decent heuristic seems to be the last one.
    dotsBounds.forEach(({ leftBound, rightBound }, i) => {
      if (
        this.props.currentSlide >= leftBound &&
        this.props.currentSlide <= rightBound
      ) {
        activeIndex = i;
      }
    });

    const dots = dotsTemplate.map((_, i) => {
      var className = classnames({
        "slick-active": i === activeIndex
      });

      var dotOptions = {
        message: "dots",
        index: i,
        slidesToScroll: this.props.slidesToScroll,
        currentSlide: this.props.currentSlide
      };

      var onClick = this.clickHandler.bind(this, dotOptions);
      return (
        <li key={i} className={className}>
          {React.cloneElement(this.props.customPaging(i), { onClick })}
        </li>
      );
    });

    return React.cloneElement(this.props.appendDots(dots), {
      className: this.props.dotsClass,
      ...mouseEvents
    });
  }
}
