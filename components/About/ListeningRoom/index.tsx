import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import GraphicEqOutlinedIcon from "@mui/icons-material/GraphicEqOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import Typography from "@mui/material/Typography";
import { Spotify } from "react-spotify-embed";
import type { FeaturedPlaylist } from "../../../utils/types";
import { WIDGET_HEIGHT } from "../../../utils/constants";
import styles from "./styles";

type ListeningRoomProps = { playlist: FeaturedPlaylist };

const ListeningRoom = ({ playlist }: ListeningRoomProps) => {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  return (
    <Box component="section" aria-label="Listening room" sx={styles.card}>
      <Box sx={styles.artwork} aria-hidden="true">
        <Box sx={styles.artworkRule} />
        <GraphicEqOutlinedIcon sx={styles.artworkIcon} />
      </Box>
      <Box sx={styles.content}>
        <Typography component="p" sx={styles.eyebrow}>
          {playlist.label}
        </Typography>
        <Typography variant="h3" sx={styles.title}>
          {playlist.title}
        </Typography>
        <Typography component="p" sx={styles.description}>
          {playlist.description}
        </Typography>
        <Box sx={styles.actions}>
          <Button
            component="a"
            href={playlist.href}
            target="_blank"
            rel="noreferrer"
            endIcon={<OpenInNewOutlinedIcon />}
            sx={styles.primaryAction}
          >
            Open in Spotify
          </Button>
          <Button
            aria-expanded={isPlayerVisible}
            aria-controls="spotify-player"
            onClick={() => setIsPlayerVisible((visible) => !visible)}
            sx={styles.secondaryAction}
          >
            {isPlayerVisible ? "Hide player" : "Play here"}
          </Button>
        </Box>
      </Box>
      <Collapse
        in={isPlayerVisible}
        timeout="auto"
        unmountOnExit
        sx={styles.playerCollapse}
      >
        <Box id="spotify-player" sx={styles.player}>
          <Spotify
            wide
            link={playlist.href}
            title={`${playlist.title} on Spotify`}
            height={WIDGET_HEIGHT}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default ListeningRoom;
