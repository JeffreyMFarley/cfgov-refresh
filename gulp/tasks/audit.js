const envvars = require( '../../config/environment' ).envvars;
const fancyLog = require( 'fancy-log' );
const fsHelper = require( '../utils/fs-helper' );
const gulp = require( 'gulp' );
const minimist = require( 'minimist' );
const spawn = require( 'child_process' ).spawn;

/**
 * Run WCAG accessibility tests.
 * @returns {ChildProcess} Hand the spawned process back to gulp.
 */
function testA11y() {
  const childProcess = spawn(
    fsHelper.getBinary( 'wcag', 'wcag', '../.bin' ),
    _getWCAGParams(),
    { stdio: 'inherit' }
  );

  childProcess.once( 'close', code => {
    _logTaskCompletion( 'WCAG', code );
  } );

  return childProcess;
}

/**
 * Processes command-line and environment variables
 * for passing to the wcag executable.
 * The URL host, port, and AChecker web API ID come from
 * environment variables, while the URL path comes
 * from the command-line `--u=` flag.
 * @returns {Array} Array of command-line arguments for wcag binary.
 */
function _getWCAGParams() {
  const commandLineParams = minimist( process.argv.slice( 2 ) );
  const host = envvars.TEST_HTTP_HOST;
  const port = envvars.TEST_HTTP_PORT;
  const checkerId = envvars.ACHECKER_ID;
  const urlPath = _parsePath( commandLineParams.u );
  const url = host + ':' + port + urlPath;
  fancyLog( `WCAG tests checking URL: http://${ url }` );

  return [ `--u=${ url }`, `--id=${ checkerId }` ];
}

/**
 * Process a path and set it to an empty string if it's undefined
 * and add a leading slash if one is not present.
 * @param {string} urlPath The unprocessed path.
 * @returns {string} The processed path.
 */
function _parsePath( urlPath ) {
  urlPath = urlPath || '';
  if ( urlPath.charAt( 0 ) !== '/' ) {
    urlPath = '/' + urlPath;
  }

  return urlPath;
}

/**
 * @param {string} pkg - A package name.
 * @param {number} code - An executable exit code.
 */
function _logTaskCompletion( pkg, code ) {
  if ( code ) {
    fancyLog( `${ pkg } tests exited with code ${ code }` );
    process.exit( 1 );
  }
  fancyLog( `${ pkg } tests done!` );
}

gulp.task( 'audit:a11y', testA11y );
