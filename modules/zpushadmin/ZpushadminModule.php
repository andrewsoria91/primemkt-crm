<?php

namespace GO\Zpushadmin;

class ZpushadminModule extends \GO\Professional\Module {

	public function install() {

		$settings = new Model\Settings();
		$settings->zpushadmin_can_connect = true;
		$settings->save();

		return parent::install();
	}

	public function depends() {
		return array('sync');
	}

	public static function zpushAdminFileExists($folder = false) {

		if (!$folder)
			$folder = self::getModuleFolder();

		return file_exists(\GO::config()->root_path . 'modules/' . $folder . '/lib/utils/zpushadmin.php');
	}

	public static function checkZPushVersion($versionToCompare) {
		\GO::debug("Compare active z-push version with: " . $versionToCompare);

//		if (!defined('ZPUSH_VERSION')) {
			self::includeZpushFiles();
//		}

		$shortversion = false;
		if (defined('ZPUSH_VERSION')) {
			\GO::debug("Found z-push version :" . ZPUSH_VERSION);

			$shortversion = substr(ZPUSH_VERSION, 0, 3);
			\GO::debug("Short z-push version :" . $shortversion);
		}else
		{
			throw new \Exception("Z-Push was not found. Is it installed?");
		}

		if ($versionToCompare === $shortversion) {
			\GO::debug("Comparison OK: " . $versionToCompare . " - " . $shortversion);
			return true;
		} else {
			\GO::debug("Comparison WRONG: " . $versionToCompare . " - " . $shortversion);
			return false;
		}
	}

	public static function getModuleFolder() {
		$folders = array('z-push', 'z-push22', 'z-push21', 'z-push2');
		$folder = false;
		foreach ($folders as $f) {
			if (is_dir(\GO::config()->root_path . 'modules/' . $f)) {
				$folder = $f;
				break;
			}
		}
		return $folder;
	}

	public static function includeZpushFiles() {
		
		if (defined('ZPUSH_VERSION')) {
			return;
		}

		$moduleFolder = self::getModuleFolder();

		\GO::debug("Using z-push folder: " . $moduleFolder);

		if (self::zpushAdminFileExists($moduleFolder)) {

			require_once \GO::config()->root_path . 'modules/' . $moduleFolder . '/vendor/autoload.php';
			include_once(\GO::config()->root_path . 'modules/' . $moduleFolder . '/config.php');


			set_include_path(get_include_path() . PATH_SEPARATOR . BASE_PATH);
			\ZPush::CheckConfig();
		}
	}

}
