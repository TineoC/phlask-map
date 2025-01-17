import { Button, Collapse, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import styles from './SelectedTapDetails.module.scss';
import CloseIcon from '@mui/icons-material/Close';

import { ReactComponent as DirectionIcon } from '../images/ArrowElbowUpRight.svg';
import { ReactComponent as CaretDownSvg } from '../images/CaretDown.svg';
import { ReactComponent as ExportSvg } from '../images/Export.svg';

import FountainIcon from '../icons/CircleWaterIcon.svg';
import ForagingIcon from '../icons/CircleForagingIcon.svg';
import FoodIcon from '../icons/CircleFoodIcon.svg';
import BathroomIcon from '../icons/CircleBathroomIcon.svg';

import {
  WATER_RESOURCE_TYPE,
  FOOD_RESOURCE_TYPE,
  FORAGE_RESOURCE_TYPE
} from '../../types/ResourceEntry';
import VerificationButton from 'components/Verification/VerificationButton';

function SelectedTapDetails(props) {
  const [pointerPositionY, setPointerPositionY] = useState(0);

  const {
    image,
    estWalkTime,
    infoCollapse,
    setInfoCollapse,
    isMobile,
    closeModal
  } = props;

  /**
   * @type {ResourceEntry}
   */
  const resource = props.selectedPlace;

  if (resource == null || Object.keys(resource).length === 0) {
    return <div></div>;
  }

  const latLongFormatted = getFormattedLatLong(
    resource.latitude,
    resource.longitude
  );

  // Assign title and subtitles, using fallbacks when data is missing
  let resourceTitle = '',
    resourceSubtitleOne,
    resourceSubtitleTwo;
  if (
    resource.name !== undefined &&
    resource.name.trim().length > 0 &&
    resource.address !== undefined &&
    resource.address.trim().length > 0
  ) {
    resourceTitle = resource.name;
    resourceSubtitleOne = resource.address;
    resourceSubtitleTwo = latLongFormatted;
  } else if (resource.name !== undefined && resource.name.trim().length > 0) {
    resourceTitle = resource.name;
    resourceSubtitleOne = latLongFormatted;
  } else if (
    resource.address !== undefined &&
    resource.address.trim().length > 0
  ) {
    resourceTitle = resource.address;
    resourceSubtitleOne = latLongFormatted;
  } else if (
    resource.latitude !== undefined &&
    resource.longitude !== undefined
  ) {
    resourceTitle = latLongFormatted;
  }

  let icon;
  switch (resource.resource_type) {
    case WATER_RESOURCE_TYPE:
      icon = FountainIcon;
      break;
    case FORAGE_RESOURCE_TYPE:
      icon = ForagingIcon;
      break;
    case FOOD_RESOURCE_TYPE:
      icon = FoodIcon;
      break;
    default:
      icon = BathroomIcon;
  }

  // From resource info, collect all the tags.
  const tags = getTagsFromResource(resource);

  const directionBtnStyle = {
    padding: '6px 20px 6px 25px',
    margin: '10px 0',
    fontSize: 16,
    borderRadius: '8px',
    textTransform: 'none',
    backgroundColor: '#00A5EE',
    width: '150px'
  };

  const TagButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    display: 'inline-block',
    wordWrap: 'break-word',
    fontSize: 14,
    color: '#2D3748',
    padding: '5px 7px',
    marginRight: '5px',
    marginBottom: '5px',
    border: '1px solid #2D3748',
    lineHeight: 1.5
  });

  // Expanding and Minimizing the Modal
  const detectSwipe = e => {
    if (!isMobile) {
      return;
    }
    setPointerPositionY(e.nativeEvent.offsetY);

    if (!infoCollapse && e.nativeEvent.offsetY < 0) {
      setInfoCollapse(true);
    }
  };

  const minimizeModal = () => {
    if (!isMobile) {
      return;
    }
    setInfoCollapse(false);
  };

  const toggleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      });
    }
  };

  return (
    <div className={styles.halfInfo} onPointerMove={detectSwipe}>
      {isMobile && !infoCollapse ? (
        <button className={styles.swipeIcon}></button>
      ) : (
        <div className={styles.expandedToolBar}>
          <div>
            <IconButton
              color="primary"
              aria-label="share"
              component="label"
              onClick={toggleNativeShare}
            >
              <ExportSvg />
            </IconButton>
            {/* TODO: Add this back in once we have real options! */}
            {/*<IconButton color="primary" aria-label="more" component="label">*/}
            {/*  <ThreeDotSvg />*/}
            {/*</IconButton>*/}
          </div>
          {/* On mobile, show the minimize button. On desktop, show the close button */}
          {isMobile && (
            <IconButton color="primary" aria-label="" onClick={minimizeModal}>
              <CaretDownSvg />
            </IconButton>
          )}
          {!isMobile && (
            <IconButton
              color="primary"
              aria-label="close"
              onClick={() => {
                closeModal();
              }}
              sx={{
                position: 'absolute',
                right: '20px',
                top: 5,
                color: 'black'
              }}
              size="large"
            >
              <CloseIcon fontSize="18px" />
            </IconButton>
          )}
          {/* Currently the three dot button does nothing */}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: '100px',
          borderRadius: '8px',
          position: 'relative'
        }}
      >
        <img src={image} className={styles.locationImage} alt="" />
        <VerificationButton resource={resource} />
      </div>
      <div className={styles.mainHalfInfo}>
        <img
          src={icon}
          alt={resource.resource_type}
          style={{ width: '52px' }}
        />
        <div className={styles.mainHalfInfoText}>
          <h2 className={styles.organization} data-cy="tap-organization-name">
            {resourceTitle}
          </h2>
          <p className={styles.subtitles}>
            {resourceSubtitleOne}
            <br />
            {resourceSubtitleTwo}
          </p>
          {props.children}
          <Button
            onClick={() =>
              window.open(
                'https://www.google.com/maps/dir/?api=1&destination=' +
                  resource.latitude +
                  ',' +
                  resource.longitude,
                '_blank'
              )
            }
            variant="contained"
            disableElevation
            sx={directionBtnStyle}
            fullWidth={false}
            startIcon={<DirectionIcon />}
          >
            Directions
          </Button>
          <p className={styles.estWalkTime}>
            Est. walking time:{' '}
            <span className={styles.walkTime}>{estWalkTime} min</span>
          </p>
        </div>
      </div>

      <div className={styles.tagGroup}>
        <hr className={styles.topDivider} />
        {tags.map((tag, index) => (
          <TagButton size="small" variant="outlined" key={index}>
            {tag.replace('_', ' ')}
          </TagButton>
        ))}
        {tags.length > 0 && <hr className={styles.botDivider} />}
      </div>

      <Collapse in={infoCollapse || !isMobile} timeout="auto" unmountOnExit>
        <div className={styles.halfInfoExpand}>
          <div className={styles.details}>
            <h3>Description</h3>
            <p>
              {resource.description
                ? resource.description
                : 'No description provided'}
            </p>
          </div>
          <div className={styles.details}>
            <h3>Guidelines</h3>
            <p>
              {resource.guidelines
                ? resource.guidelines
                : 'No statement provided'}
            </p>
          </div>
        </div>
      </Collapse>
    </div>
  );
}

/**
 * Get a list of tags to display for a resources
 * @param {ResourceEntry} resource
 * @returns {Array<string>} A list of tags to display in the UI
 */
function getTagsFromResource(resource) {
  // First, get the tags
  const tags = [
    resource.water,
    resource.food,
    resource.forage,
    resource.bathroom
  ]
    .filter(Boolean) // Filter out any missing resources if it is not that type
    .flatMap(item => item.tags);

  // Then , get resource-specific information
  if (resource.water) {
    tags.push(...(resource.water.dispenser_type || []));
  }
  if (resource.food) {
    tags.push(...(resource.food.food_type || []));
    tags.push(...(resource.food.distribution_type || []));
    tags.push(...(resource.food.organization_type || []));
  }
  if (resource.forage) {
    tags.push(...(resource.forage.forage_type || []));
  }

  return tags.filter(Boolean).sort(); // Tags are optional, so filter out missing tags too
}

/**
 * Converts degrees given in decimal to DMS (degrees, minutes, and seconds), where seconds are
 * rounded to the tenth place. The returned degrees are not clamped or wrapped in any way.
 *
 * @param {number} degrees Degrees given in decimal
 */
function decimalDegreesToDMS(decimalDegrees) {
  let integralDegrees = Math.trunc(decimalDegrees);
  const fractionalDegrees =
    Math.abs(decimalDegrees) - Math.abs(integralDegrees);
  const fractionalDegreesInMinutes = fractionalDegrees * 60;
  let minutes = Math.trunc(fractionalDegreesInMinutes);
  const remainingFractionalDegreesInMinutes =
    fractionalDegreesInMinutes - minutes;
  const seconds = remainingFractionalDegreesInMinutes * 60;
  let roundedSeconds = Number(seconds.toFixed(1));
  // Account for rounding edge case
  if (roundedSeconds === 60) {
    minutes += 1;
    roundedSeconds = 0;
  }
  if (minutes === 60) {
    integralDegrees += 1;
    minutes = 0;
  }
  return {
    deg: integralDegrees,
    min: minutes,
    sec: roundedSeconds
  };
}

/**
 * Returns a formatted string with the latitude and longitude.
 * Example return value: 13°39'49.7"N 45°9'35.6"E
 *
 * Clamps latitude values to be within [-90, 90] and wraps longitude
 * values to be within [-180, 180).
 *
 * @param {number} latitude Latitude given as a decimal
 * @param {number} longitude Longitude given as a decimal
 * @returns {string} A formatted string with the latitude and logitude
 */
function getFormattedLatLong(latitude, longitude) {
  let clampedLatitude, wrappedLongitude;

  if (latitude < -90) clampedLatitude = -90;
  else if (latitude > 90) clampedLatitude = 90;
  else clampedLatitude = latitude;

  wrappedLongitude = longitude % 180;

  const latitudeDMS = decimalDegreesToDMS(clampedLatitude);
  const longitudeDMS = decimalDegreesToDMS(wrappedLongitude);

  const latitudeDir = latitudeDMS.deg < 0 ? 'S' : 'N';
  const longitudeDir = longitudeDMS.deg < 0 ? 'W' : 'E';

  const latitudeFormatted = `${latitudeDMS.deg}\u00B0${latitudeDMS.min}'${latitudeDMS.sec}"${latitudeDir}`;
  const longitudeFormatted = `${longitudeDMS.deg}\u00B0${longitudeDMS.min}'${longitudeDMS.sec}"${longitudeDir}`;

  return `${latitudeFormatted} ${longitudeFormatted}`;
}

export default SelectedTapDetails;
