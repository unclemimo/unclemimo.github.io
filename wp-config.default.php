<?php
/**
 * Default config settings
 *
 * Enter any WordPress config settings that are default to all environments
 * in this file.
 * 
 * Please note if you add constants in this file (i.e. define statements) 
 * these cannot be overridden in environment config files so make sure these are only set once.
 * 
 * @package    Studio 24 WordPress Multi-Environment Config
 * @version    2.0.0
 * @author     Studio 24 Ltd  <hello@studio24.net>
 */
  

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '.|R3.NkE}d/;r#T9T4Sdu!l!4f`o>CYb`=*YxZ9!f@C|1`A-gziC0Jo~JF|;<GdS' );
define( 'SECURE_AUTH_KEY',   'cdNqp0]AZ?/=56Ov4A1d%]3y_?~E{1KcK:zZ$ru715le,0d?&~HpQ]GA@p&eI{qL' );
define( 'LOGGED_IN_KEY',     'R:5Ls2{g8Z+J*R,*Cuuc%TjZE4*bCgsE0%WOY&QuFO7Yg-ZZ=M2Z.?oJMlW[U}n>' );
define( 'NONCE_KEY',         'U6~<}!w WDiO;d/Lu-Uq*s(6eE31N=f4IrA8hCOqtqIsS};WYG!q~~];TnVw!`u:' );
define( 'AUTH_SALT',         '}+GIcVH<NVuBZ-cEBkT&7* $g|YN,%?P/knP4t1,la[@(Y*z|{;+XDK_&lYh^#}<' );
define( 'SECURE_AUTH_SALT',  '(}0)u`qwqgT10+zaEf]b5|#9xm6J$2Xpc?;wB`ZzV4v)nH|AYF(6Gi1cyH]q>+)H' );
define( 'LOGGED_IN_SALT',    '~^-XqYLB~2*}6R1*Ps#PEZ@<`;Mh}HylD`|a(zyr_1}&FW{J2=]L+G-G4i^;.Qi*' );
define( 'NONCE_SALT',        '51u{)B cRJOe3}nAMlQt)y/pJ;yE>s/cF.Lmqra +KU_9ky!+{?$P@./y>.4:Zaa' );
define( 'WP_CACHE_KEY_SALT', '`Z7,{.ZFK-~eFe;(ajSaLNr=G>(V_PtzuIH3>F~wTipF:qe(K{el)S|awIl[e1ex' );

/**#@-*/


/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');


// Recommended WP config settings, uncomment to use these

/**
 * Increase memory limit. 
 */
//define('WP_MEMORY_LIMIT', '256M');

/**
 * Limit post revisions.
 */
//define('WP_POST_REVISIONS', 5);

/**
 * Disable automatic updates.
 */
//define( 'AUTOMATIC_UPDATER_DISABLED', true );

/**
 * Disable file editor.
 */
//define( 'DISALLOW_FILE_EDIT', true );
