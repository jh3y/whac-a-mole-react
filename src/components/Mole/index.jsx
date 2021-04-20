import T from 'prop-types'
import React, { useEffect, useCallback, useState, useRef } from 'react'
import gsap from 'gsap'
import constants from '../../constants'
import './mole.css'

// This is the centerpiece of the game.
// It's the most complex component. But don't be scared of it!
const Mole = ({
  active = false,
  loading = false,
  onWhack,
  speed,
  delay,
  points,
  pointsMin = 10,
}) => {
  const [whacked, setWhacked] = useState(false)
  const delayedRef = useRef(null)
  const pointsRef = useRef(points)
  const buttonRef = useRef(null)
  const capBody = useRef(null)
  const moleRef = useRef(null)
  const capPeak = useRef(null)
  const loadingRef = useRef(null)
  const noseRef = useRef(null)
  const moleContainerRef = useRef(null)
  const faceRef = useRef(null)
  const capRef = useRef(null)
  const specsRef = useRef(null)
  const bobRef = useRef(null)
  const eyesRef = useRef(null)
  const tummyRef = useRef(null)

  // Use a callback to cache the function and share it between effects.
  const setMole = useCallback(
    (
      override,
      accent = 45,
      shades = 1,
      golden = 1,
      hue = 45,
      lightness = 65
    ) => {
      // Give a 1% chance of getting the "Golden" Mole.
      if (Math.random() > 0.99 || override) {
        // Create the "Golden" Mole
        pointsRef.current = constants.GOLDEN_SCORE
        // Set the specs and cap as displayed
        gsap.set([capRef.current, specsRef.current], {
          display: 'block',
        })
        // Set specific colors and that the shades/golden are active
        gsap.set(moleContainerRef.current, {
          '--accent': accent,
          '--shades': shades,
          '--golden': golden,
          '--hue': hue,
          '--lightness': lightness,
        })
      } else {
        // Create a "Regular" Mole
        pointsRef.current = constants.REGULAR_SCORE
        // Set whether Mole has a cap or specs
        gsap.set([capRef.current, specsRef.current], {
          display: () => (Math.random() > 0.5 ? 'block' : 'none'),
        })
        // Set random colors for Mole.
        gsap.set(moleContainerRef.current, {
          '--accent': gsap.utils.random(0, 359),
          '--shades': Math.random() > 0.65 ? 1 : 0,
          '--golden': 0,
          '--hue':
            Math.random() > 0.5
              ? gsap.utils.random(185, 215)
              : gsap.utils.random(30, 50),
          '--lightness': gsap.utils.random(45, 75),
        })
      }
    },
    []
  )

  // Use an effect to get the Mole moving
  useEffect(() => {
    // Set the Mole position and overlay button to underground
    gsap.set([moleRef.current, buttonRef.current], {
      yPercent: 100,
    })
    // Show Mole
    gsap.set(moleRef.current, { display: 'block' })
    // Create the bobbing timeline and store a ref so we can kill it on unmount.
    // Timeline behavior defined by props
    if (active) {
      // Set characteristics for the Mole.
      setMole()
      bobRef.current = gsap.to([buttonRef.current, moleRef.current], {
        yPercent: 0,
        duration: speed,
        yoyo: true,
        repeat: -1,
        delay,
        repeatDelay: delay,
        onRepeat: () => {
          pointsRef.current = Math.floor(
            Math.max(pointsRef.current * constants.POINTS_MULTIPLIER, pointsMin)
          )
        },
      })
    }
    // Cleanup the timeline on unmount
    return () => {
      if (bobRef.current) bobRef.current.kill()
    }
  }, [active, delay, pointsMin, speed, setMole])

  // When a Mole is whacked, animate it underground
  // Swap out the Mole style, reset it, and speed up the bobbing timeline.
  useEffect(() => {
    if (whacked) {
      // Render something in the body
      bobRef.current.pause()
      gsap.to([moleRef.current, buttonRef.current], {
        yPercent: 100,
        duration: 0.1,
        onComplete: () => {
          delayedRef.current = gsap.delayedCall(gsap.utils.random(1, 3), () => {
            setMole()
            setWhacked(false)
            bobRef.current
              .restart()
              .timeScale(bobRef.current.timeScale() * constants.TIME_MULTIPLIER)
          })
        },
      })
    }
    // If the delayed restart isn't started and we unmount, it will need cleaning up.
    return () => {
      if (delayedRef.current) delayedRef.current.kill()
    }
  }, [whacked, setMole])

  // If a Mole is set to loading, play the loading animation version
  useEffect(() => {
    if (loading) {
      setMole(true, 10, 1, 0, 200, 70)
      loadingRef.current = gsap
        .timeline({
          repeat: -1,
          repeatDelay: 1,
        })
        // Shooting up!
        .to(moleRef.current, {
          yPercent: 5,
          ease: 'back.out(1)',
        })
        .to(
          capRef.current,
          {
            yPercent: -15,
            duration: 0.1,
            repeat: 1,
            yoyo: true,
          },
          '>-0.2'
        )
        // Side to side
        .to([capBody.current, faceRef.current], {
          xPercent: 10,
        })
        .to(
          capPeak.current,
          {
            xPercent: -10,
          },
          '<'
        )
        .to(
          [eyesRef.current, specsRef.current, tummyRef.current],
          {
            xPercent: 8,
          },
          '<'
        )
        .to(
          noseRef.current,
          {
            xPercent: 25,
          },
          '<'
        )
        .to([faceRef.current, capBody.current], {
          xPercent: -10,
          duration: 0.75,
        })
        .to(
          capPeak.current,
          {
            xPercent: 28,
            duration: 0.5,
          },
          '<'
        )
        .to(
          [eyesRef.current, specsRef.current, tummyRef.current],
          {
            xPercent: -8,
            duration: 0.75,
          },
          '<'
        )
        .to(
          noseRef.current,
          {
            xPercent: -25,
            duration: 0.75,
          },
          '<'
        )
        .to(moleRef.current, {
          yPercent: 100,
          delay: 0.2,
          ease: 'power4.in',
        })
        .to(
          capRef.current,
          {
            yPercent: -15,
            duration: 0.2,
            ease: 'power4.in',
          },
          '<+0.05'
        )
    }
    return () => {
      gsap.set(
        [
          capRef.current,
          capPeak.current,
          capBody.current,
          faceRef.current,
          noseRef.current,
          eyesRef.current,
          specsRef.current,
          tummyRef.current,
        ],
        {
          xPercent: 0,
          yPercent: 0,
        }
      )
      if (loadingRef.current) loadingRef.current.kill()
    }
  }, [loading])

  // To render the score, we don't need React elements.
  // We can render them straight to the DOM and remove them once they've animated.
  // Alternatively, we could use a React DOM Portal. However, our element has
  // a short lifespan and doesn't update, etc.
  const renderScore = (x, y) => {
    const SCORE_HOLDER = document.createElement('div')
    SCORE_HOLDER.className = 'mole__points-holder'
    const SCORE = document.createElement('div')
    SCORE.className = 'mole__points'
    SCORE.innerText = pointsRef.current
    SCORE_HOLDER.appendChild(SCORE)
    document.body.appendChild(SCORE_HOLDER)
    gsap.set(SCORE_HOLDER, {
      '--angle': gsap.utils.random(-35, 35),
      '--accent': gsap.utils.random(0, 359),
    })
    gsap
      .timeline({
        onComplete: () => SCORE_HOLDER.remove(),
      })
      .set(SCORE_HOLDER, {
        left: x,
        top: y,
      })
      .to(SCORE, {
        yPercent: -100,
        duration: 0.35,
      })
      .to(
        SCORE,
        {
          opacity: 0,
          duration: 0.1,
        },
        '>-0.1'
      )
  }

  // On Whack, set "whacked" to true.
  // At the same time, render a score in the appropriate spot
  // And fire the callback so the Game can track the score.
  // If the pointsRef is higher than half the golden score
  // We know it's golden Mole so we can play a different sound.
  const whack = (e) => {
    setWhacked(true)
    renderScore(e.pageX, e.pageY)
    onWhack(pointsRef.current, pointsRef.current > constants.GOLDEN_SCORE * 0.5)
  }

  // Much of what is rendered is the Mole SVG and the Hole.
  // You could do this with images and CSS based on your design.
  return (
    <div className="mole__hole" ref={moleContainerRef}>
      <svg
        className="mole"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient
            id="mole-shadow"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(101 137) rotate(90) scale(115 90.9302)">
            <stop stopColor="transparent" stopOpacity="0" />
            <stop offset="1" stopColor="hsla(var(--hue, 0), 10%, 10%, 0.35)" />
          </radialGradient>
        </defs>
        <g className="mole__ground">
          <clipPath id="hole-mask" x={0} y={150} width={200} height={50}>
            <ellipse cx={100} cy={175} rx={100} ry={25} />
          </clipPath>
          <g clipPath="url(#hole-mask)">
            <ellipse cx={100} cy={175} rx={100} ry={25} className="hole__lip" />
            <ellipse cx={100} cy={190} rx={100} ry={25} className="hole" />
          </g>
        </g>
        <clipPath id="mole-clip">
          <path
            transform="translate(0 0.5)"
            d="M200 0H0V175.58C0 188.764 44.7715 200 100 200C155.228 200 200 188.751 200 175.58V0Z"
          />
        </clipPath>
        <g clipPath="url(#mole-clip)">
          <g className="mole__mole" ref={moleRef}>
            <path
              d="M68.2872 22.3162C78.222 18.2447 89.0989 16 100.5 16C147.444 16 185.5 54.0558 185.5 101V266H15.5V101C15.5 77.2309 25.2562 55.7405 40.9826 40.3149C39.7451 39.0121 39 37.3328 39 35.5C39 31.3579 42.8056 28 47.5 28C48.4021 28 49.2714 28.124 50.0872 28.3537C51.3734 22.0787 56.7717 17.8064 62.349 18.748C64.7464 19.1528 66.7962 20.4567 68.2872 22.3162Z"
              className="mole__body"
            />
            <path
              d="M68.2872 22.3162C78.222 18.2447 89.0989 16 100.5 16C147.444 16 185.5 54.0558 185.5 101V266H15.5V101C15.5 77.2309 25.2562 55.7405 40.9826 40.3149C39.7451 39.0121 39 37.3328 39 35.5C39 31.3579 42.8056 28 47.5 28C48.4021 28 49.2714 28.124 50.0872 28.3537C51.3734 22.0787 56.7717 17.8064 62.349 18.748C64.7464 19.1528 66.7962 20.4567 68.2872 22.3162Z"
              fill="url(#mole-shadow)"
              className="mole__gradient"
            />
            <rect
              ref={tummyRef}
              x="45.5"
              y="155"
              width="110"
              height="123"
              rx="55"
              className="mole__white"
            />
            <g className="mole__eyes" ref={eyesRef}>
              <circle className="mole__feature" cx="53" cy="84" r="6" />
              <circle className="mole__feature" cx="148" cy="84" r="6" />
            </g>
            <g className="mole__eyes--crossed">
              <path
                d="M47.343 78.343a1 1 0 0 1 1.414 0l9.9 9.9a1 1 0 0 1-1.414 1.414l-9.9-9.9a1 1 0 0 1 0-1.414z"
                className="mole__feature"
                strokeWidth="2"
              />
              <path
                d="M58.657 78.343a1 1 0 0 1 0 1.414l-9.9 9.9a1 1 0 0 1-1.414-1.414l9.9-9.9a1 1 0 0 1 1.414 0zm95 0a1 1 0 0 1 0 1.414l-9.9 9.9a1 1 0 1 1-1.414-1.414l9.9-9.9a1 1 0 0 1 1.414 0z"
                className="mole__feature"
                strokeWidth="2"
              />
              <path
                d="M153.657 89.657a1 1 0 0 1-1.414 0l-9.9-9.9a1 1 0 0 1 1.414-1.414l9.9 9.9a1 1 0 0 1 0 1.414z"
                className="mole__feature"
                strokeWidth="2"
              />
            </g>
            <clipPath id="muzzle-clip" x="60" y="82" width="81" height="50">
              <ellipse cx="100.5" cy="107" rx="40" ry="25" />
            </clipPath>
            <g ref={faceRef}>
              <g clipPath="url(#muzzle-clip)">
                <ellipse
                  className="mole__shadow"
                  cx="100.5"
                  cy="107"
                  rx="40"
                  ry="25"
                />
                <ellipse
                  className="mole__white"
                  cx="100.5"
                  cy="103"
                  rx="40"
                  ry="25"
                />
              </g>
              <path
                className="mole__whiskers"
                strokeWidth="2"
                strokeLinecap="round"
                d="m32.051 101.054 36.003 1.895m65.577 8.202 33.02 4.718m-97.98-7.724-35.526 5.684m133.884-11.801-33.501.943"
              />
              <ellipse
                ref={noseRef}
                className="mole__nose"
                cx="100.5"
                cy="91"
                rx="10"
                ry="6"
              />
            </g>
            <g className="specs" ref={specsRef}>
              <circle
                cx="53"
                cy="84"
                r="12"
                className="specs__lens"
                strokeWidth="4"
              />
              <circle
                className="specs__lens"
                cx="148"
                cy="84"
                r="12"
                strokeWidth="4"
              />
              <path
                className="specs__bridge"
                d="M65 84s14-6 36.5-6 34.5 6 34.5 6"
                stroke="#000"
                strokeWidth="4"
              />
              <clipPath id="lens-clip" x="43" y="74" width="20" height="20">
                <circle cx="53" cy="84" r="10" />
              </clipPath>
              <g clipPath="url(#lens-clip)" className="specs__glare">
                <path d="m57.006 56 4.23 2.1-24.006 48.37-4.23-2.1zm5 3 2.154 1.07-24.006 48.37L38 107.37z" />
              </g>
            </g>
            <g className="mole__cap" ref={capRef}>
              <path
                ref={capPeak}
                d="M57 61.273C57 63.683 42.578 64 30.882 64 19.187 64 9 63.455 9 62.364 9 59.954 26.246 58 37.941 58 49.637 58 57 58.863 57 61.273z"
                className="cap__accent"
              />
              <path className="cap__accent" d="M32 56h136v8H32z" />
              <clipPath
                id="cap-clip"
                maskUnits="userSpaceOnUse"
                x="22"
                y="8"
                width="157"
                height="57">
                <path d="M99.5 8C71 8 29 25.5 22 64.5h157C173.5 21.5 128 8 99.5 8z" />
              </clipPath>
              <g clipPath="url(#cap-clip)">
                <path
                  ref={capBody}
                  d="M-10 8h220v57h-89.5V51.5H82V65h-92V8z"
                  className="cap__body"
                />
              </g>
              <ellipse
                cx="100.5"
                cy="8.5"
                rx="6"
                ry="2.5"
                className="cap__accent"
              />
            </g>
          </g>
        </g>
        <g clipPath="url(#mole-clip)">
          <foreignObject x={0} y={0} width={200} height={200}>
            <button ref={buttonRef} onClick={whack} className="mole__whack">
              Whack!
            </button>
          </foreignObject>
        </g>
      </svg>
    </div>
  )
}

Mole.defaultProps = {
  pointsMin: 10,
}

Mole.propTypes = {
  active: T.bool.isRequired,
  loading: T.bool.isRequired,
  onWhack: T.func.isRequired,
  speed: T.number.isRequired,
  delay: T.number.isRequired,
  points: T.number.isRequired,
  pointsMin: T.number,
}

export default Mole
