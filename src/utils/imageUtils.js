// Fixed image utility for handling static assets
// This utility ensures images work correctly in both development and production

// Centralized game image mapping for all sports
export const gameImageMap = {
  'archery': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201924/archery_foy88h.jpg',
  'arm-wrestling': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201925/arm-wrestling_ok4aka.jpg',
  'athletics': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201924/athletics_nx5ajp.jpg',
  'atya-patya': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201925/atya-patya_fw0glx.jpg',
  'badminton': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201925/badminton_ldbkfv.jpg',
  'baseball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201925/baseball_emu7aq.jpg',
  'basketball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201926/basketball_yddtdk.jpg',
  'beach-volleyball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201926/beach-volleyball_s3lgus.jpg',
  'billiards': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201926/billiards_avscut.jpg',
  'boxing': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201926/boxing_qt7jyx.jpg',
  'carrom': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/carrom_m1p30e.jpg',
  'chaturanga': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/chaturanga_sbtzsp.jpg',
  'canoeing': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/canoeing_x8gjcs.jpg',
  'chaupar': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/chaupar_jrrmrv.jpg',
  'chess': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201928/chess_cyxej0.jpg',
  'cricket': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201928/cricket_sgh2mw.jpg',
  'cycling': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201928/cycling_smexdq.jpg',
  'dance': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201929/dance_pubntr.jpg',
  'discus-throw': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201929/discus-throw_yvtdu3.jpg',
  'diving': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201929/diving_lcfqzt.jpg',
  'dodgeball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201930/dodgeball_m8jeqy.jpg',
  'equestrian': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201930/equestrian_xdhqfe.jpg',
  'esports': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201930/esports_kdqcn9.jpg',
  'fencing': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201930/fencing_ke3dek.jpg',
  'field-hockey': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201931/field-hockey_xpfvnf.jpg',
  'football': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201931/football_etnazv.jpg',
  'gatka': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201931/gatka_kva8sq.jpg',
  'gilli-danda': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201932/gilli-danda_ubpqmn.jpg',
  'golf': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201932/golf_rcus47.jpg',
  'gymnastics': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201933/gymnastics_ijduhw.jpg',
  'handball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201933/handball_y4aksj.jpg',
  'high-jump': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201933/high-jump_oyxrap.jpg',
  'hockey': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201934/hockey_mixkdy.jpg',
  'hopscotch': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201934/hopscotch_zmliaq.jpg',
  'judo': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201934/judo_ynvapy.jpg',
  'javelin-throw': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201934/javelin-throw_xqw1po.jpg',
  'kabaddi': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201935/kabaddi_eczmm0.jpg',
  'hide-and-seek': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201935/hide-and-seek_ipih83.jpg',
  'kalaripayattu': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201935/kalaripayattu_ulgbyv.jpg',
  'kayaking': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201935/kayaking_lalxt5.jpg',
  'karate': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201936/karate_rq0rwn.jpg',
  'kho-kho': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201936/kho-kho_kiqtkh.jpg',
  'kung-fu': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201936/kung-fu_m7fiiu.jpg',
  'lagori': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201936/lagori_szcmv0.jpg',
  'langdi': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201937/langdi_kljoaw.jpg',
  'lattoo': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201937/lattoo_almrk9.jpg',
  'lawn-tennis': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201937/lawn-tennis_tmbkft.jpg',
  'mallakhamb': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201938/mallakhamb_rvtkgu.jpg',
  'marathon': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201938/marathon_uvnwtt.jpg',
  'marbles': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201938/marbles_aggy2k.jpg',
  'martialarts': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201938/martialarts_e3h9mk.jpg',
  'mountaineering': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201939/mountaineering_kfpyyw.jpg',
  'muay-thai': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201939/muay-thai_t6tkan.jpg',
  'paddle-tennis': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201940/paddle-tennis_xiw833.jpg',
  'pallanguzhi': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201940/pallanguzhi_jicc7f.jpg',
  'pickleball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201940/pickleball_axcmep.jpg',
  'pole-vault': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201940/pole-vault_wzkf0w.jpg',
  'powerlifting': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201940/powerlifting_kwqsxs.jpg',
  'relay-race': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201941/relay-race_ke8ehf.jpg',
  'rock-climbing': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201941/rock-climbing_i2cmkm.jpg',
  'rowing': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201941/rowing_vnphi3.jpg',
  'rugby': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201942/rugby_asqn2r.jpg',
  'running': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201942/running_ibudcq.jpg',
  'sailing': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201943/sailing_fonbot.jpg',
  'sambo': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201943/sambo_rqu0v6.jpg',
  'sepak-takraw': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201943/sepak-takraw_ztd0tv.jpg',
  'shooting': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201943/shooting_dbqxyt.jpg',
  'shot-put': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201944/shot-put_xjgfah.jpg',
  'silambam': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201944/silambam_myeumf.jpg',
  'skateboarding': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201944/skateboarding_r4mytn.jpg',
  'skiing': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201944/skiing_avd0sb.jpg',
  'snakes-and-ladders': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201945/snakes-and-ladders_eofhrp.png',
  'snooker': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201945/snooker_qxr9dv.jpg',
  'softball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201945/softball_uhyvya.jpg',
  'squash': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201945/squash_yuuccd.jpg',
  'surfing': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201946/surfing_lfppji.jpg',
  'swimming': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201946/swimming_ck7hem.jpg',
  'taekwondo': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201946/taekwondo_oa5vsh.jpg',
  'table-tennis': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201946/table-tennis_hvvkay.jpg',
  'tennis': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201947/tennis_kpgzbh.jpg',
  'triathlon': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201947/triathlon_o2svzx.jpg',
  'tug-of-war': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201947/tug-of-war_yb2ojj.jpg',
  'volleyball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201948/volleyball_hqvsvl.jpg',
  'water-polo': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201948/water-polo_apnezg.jpg',
  'weightlifting': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201949/weightlifting_eewfxe.jpg',
  'wrestling': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201949/wrestling_b07epm.jpg',
  'wushu': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201950/wushu_tk0tvs.jpg',
  'yoga': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201950/yoga_xsg1mi.jpg'
};

/**
 * Get the correct path for static images in the public folder
 * @param {string} imagePath - Path relative to public folder (e.g., '/images/logo.png')
 * @returns {string} - Correct absolute path for the image
 */
export const getImagePath = (imagePath) => {
  // Handle empty or null paths
  if (!imagePath) {
    console.warn('Empty path provided to getImagePath');
    return '/images/logo.png'; // Default fallback
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Ensure path starts with a slash
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  // For production deployments, we need to handle custom domains
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && window.location) {
    const { origin, hostname } = window.location;

    // For localhost development, use relative paths
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return normalizedPath;
    }

    // For custom domains like www.viksorasports.com, prepend the domain to the path
    if (hostname === 'www.viksorasports.com' || hostname === 'viksorasports.com') {
      return `https://www.viksorasports.com${normalizedPath}`;
    }

    // Default to relative path for other hosts
    return normalizedPath;
  }

  // Fallback to normalized path
  return normalizedPath;
};

/**
 * Get sports image path with proper fallback handling
 * @param {string} gameName - Name of the game
 * @param {string} extension - File extension (default: 'jpeg')
 * @returns {string} - Image path or fallback URL
 */
export const getSportsImagePath = (gameName, extension = 'jpeg') => {
  if (!gameName) {
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  }

  // Normalize the game name for filename
  const normalizedName = gameName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const imagePath = `/images/sports/${normalizedName}.${extension}`;
  return getImagePath(imagePath);
};

/**
 * Function to handle image loading errors
 * @param {HTMLImageElement} imgElement - The img element that failed to load
 * @param {string} gameName - Name of the game for fallback
 * @param {Function} onErrorCallback - Optional callback to execute when image fails to load
 * @returns {boolean} - True if a fallback was applied, false otherwise
 */
export const handleImageError = (imgElement, gameName, onErrorCallback) => {
  if (!imgElement) return false;

  console.error("Image failed to load:", imgElement.src);

  // Check if there's a Cloudinary URL for this game
  if (gameName) {
    const normalizedName = gameName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    if (gameImageMap[normalizedName] && imgElement.src !== gameImageMap[normalizedName]) {
      console.log("Trying Cloudinary URL for", normalizedName, ":", gameImageMap[normalizedName]);
      imgElement.src = gameImageMap[normalizedName];
      return true;
    }
  }

  // For sports images, try alternative extensions
  if (imgElement.src.includes('/images/sports/')) {
    const currentSrc = imgElement.src;

    // Try alternative extensions
    if (currentSrc.includes('.jpeg')) {
      const jpgSrc = currentSrc.replace('.jpeg', '.jpg');
      console.log("Trying .jpg extension:", jpgSrc);
      imgElement.src = jpgSrc;
      return true;
    } else if (currentSrc.includes('.jpg')) {
      const jpegSrc = currentSrc.replace('.jpg', '.jpeg');
      console.log("Trying .jpeg extension:", jpegSrc);
      imgElement.src = jpegSrc;
      return true;
    }

    // Try without hyphens (e.g., table-tennis -> tabletennis)
    if (currentSrc.includes('-')) {
      const noHyphenSrc = currentSrc.replace(/-/g, '');
      console.log("Trying without hyphens:", noHyphenSrc);
      imgElement.src = noHyphenSrc;
      return true;
    }
  }

  // If no fallback or fallback also failed, try to use logo as placeholder
  if (!imgElement.src.includes('logo.png') && !imgElement.src.includes('unsplash')) {
    const logoFallback = getImagePath('/images/logo.png');
    console.log("Trying logo as placeholder:", logoFallback);
    imgElement.src = logoFallback;
    return true;
  }

  // Final fallback to Unsplash placeholder
  if (!imgElement.src.includes('unsplash')) {
    console.log("Using Unsplash placeholder as final fallback");
    imgElement.src = 'https://images.unsplash.com/photo-1630734242335-1555e4a438a0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxwbGFjZWhvbGRlciUyMHNwb3J0cyUyMGdlbmVyaWN8ZW58MHwyfHx8MTc1ODE3OTY1Mnww&ixlib=rb-4.1.0&q=85';
    imgElement.alt = 'Placeholder image - MJH SHIKDER on Unsplash';
    return true;
  }

  // Execute callback if provided
  if (onErrorCallback && typeof onErrorCallback === 'function') {
    onErrorCallback();
  }

  return false;
};

/**
 * Function to get game image path with multiple fallback options
 * @param {Object} game - Game object
 * @param {string} fallbackName - Optional fallback name
 * @returns {string} - Image path
 */
export const getGameImagePath = (game, fallbackName) => {
  // If the game has a full URL image (either image or imageUrl), use it
  if (game.image && game.image.startsWith('http')) {
    return game.image;
  }
  if (game.imageUrl && game.imageUrl.startsWith('http')) {
    return game.imageUrl;
  }

  // If the game has an image property, use it through the centralized utility
  if (game.image) {
    // Check if it already includes the path
    if (game.image.startsWith('/images/')) {
      return getImagePath(game.image);
    }
    return getImagePath(`/images/sports/${game.image}`);
  }

  // Check if there's a Cloudinary URL for this game in the gameImageMap
  if (game.name) {
    const normalizedName = game.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    if (gameImageMap[normalizedName]) {
      return gameImageMap[normalizedName];
    }
  }

  // Use the new getSportsImagePath function for better handling
  if (game.name) {
    return getSportsImagePath(game.name);
  }

  // Use fallback name if available
  if (fallbackName) {
    return getSportsImagePath(fallbackName);
  }

  // Final fallback to Unsplash
  return `https://source.unsplash.com/800x600/?${encodeURIComponent(game.name || fallbackName || 'sports')}`;
};
