import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";
import { useImmer } from "use-immer";
import { Link } from "@reach/router";

import { selectRoom, selectNumPlayers } from "src/containers/Room/selectors";
import styles from "./styles.module.scss";

function Room({ id, inFocus, onFocus }) {
  const liElement = useRef(null);
  const room = useSelector(selectRoom(id));
  const numPlayers = useSelector(selectNumPlayers(id));
  const [styleNames, updateStyleNames] = useImmer({ [styles.li]: true });
  const className = classnames(styleNames);
  function handlePointerEnter() {
    updateStyleNames(names => {
      names[styles.liHover] = true;
    });
  }
  function handlePointerLeave() {
    updateStyleNames(names => {
      names[styles.liHover] = false;
      names[styles.liDown] = false;
    });
  }
  function handlePointerDown() {
    updateStyleNames(names => {
      names[styles.liDown] = true;
    });
  }
  function handlePointerUp() {
    updateStyleNames(names => {
      names[styles.liDown] = false;
    });
  }

  useEffect(() => {
    if (inFocus) {
      liElement.current.focus();
    } else {
      liElement.current.blur();
    }
  }, [liElement, inFocus]);

  if (!id || !room) {
    return null;
  }
  return (
    <li className={className}>
      <Link
        ref={liElement}
        className={styles.link}
        to={`/rooms/${id}`}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onFocus={() => onFocus(id)}
      >
        <div className={styles.playersCount}>
          <span className={styles.playersCountTxt}>
            [{numPlayers}/{room.maxPlayers}]
          </span>
        </div>
        <div className={styles.name}>
          {room.name}
          {room.password && (
            <span
              className={styles.password}
              role="img"
              aria-label="Room requires a password"
              title="Room requires a password"
            >
              🔐
            </span>
          )}
        </div>
        <div className={styles.started}>
          {room.gameState.gameStarted && <i>(started)</i>}
        </div>
      </Link>
    </li>
  );
}

export default Room;
