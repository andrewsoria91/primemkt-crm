<?php

namespace GO\Exactonline;

use GO;
use GO\Base\Module;
use GO\Exactonline\Model\Project2IncomeExtension;
use GO\Exactonline\Model\ProjectTemplateExtension;
use GO\Projects2\Controller\ProjectController;
use GO\Projects2\Controller\SettingsController;
use GO\Projects2\Controller\TemplateController;


class ExactonlineModule extends Module {
	
	public static function initListeners() {
		if(GO::modules()->isInstalled('projects2')){
			$templateController = new TemplateController();
			$templateController->addListener('submit', "GO\Exactonline\ExactonlineModule", "afterProjectTemplateSubmit");
			$templateController->addListener('load', "GO\Exactonline\ExactonlineModule", "afterProjectTemplateLoad");
			$projectController = new ProjectController();
			$projectController->addListener('displayformatincome', "GO\Exactonline\ExactonlineModule", "projectDisplayFormatIncome");
			
			$incomeController = new \GO\Projects2\Controller\IncomeController();
			$incomeController->addListener('beforeDbStore', "GO\Exactonline\ExactonlineModule", 'beforeDbStoreIncomeController');
//			beforeDbStore
			
			
			$c = new SettingsController();
			$c->addListener('submit', 'GO\Exactonline\ExactonlineModule', 'submitApiSettings');
			$c->addListener('load', 'GO\Exactonline\ExactonlineModule', 'loadApiSettings');
		}
		
		GO::config()->addListener('init', 'GO\Exactonline\ExactonlineModule', 'registerAutoload');
		
		
	}
	
	public static function registerAutoload() {		
		require(dirname(__FILE__).'/vendor/autoload.php');
	}
			
	public function package() {
		return self::PACKAGE_CUSTOM;
	}
	
	public function depends() {
		return array('billing','projects2');
	}
	
	public static function afterProjectTemplateSubmit(TemplateController $templateController, &$response, &$templateModel, &$params, $modifiedAttributes) {
		
		$projectTemplateExactModel = ProjectTemplateExtension::model()->findByPk($templateModel->id);
		if (!$projectTemplateExactModel) {
			$projectTemplateExactModel = new ProjectTemplateExtension();
			$projectTemplateExactModel->template_id = $templateModel->id;
		}
		
		$projectTemplateExactModel->division_number = $params['exactonline_division_number'];
		$projectTemplateExactModel->save();
		
	}
	
	public static function afterProjectTemplateLoad(TemplateController $templateController, &$response, &$templateModel, &$params) {
		
		$projectTemplateExactModel = ProjectTemplateExtension::model()->findByPk($templateModel->id);
		if ($projectTemplateExactModel)
			$response['data']['exactonline_division_number'] = $projectTemplateExactModel->division_number;
		
	}
	
	public static function projectDisplayFormatIncome(\GO\Projects2\Model\Project $projectModel, &$incomeAttributes) {
		
		$incomeAttributes['invoice_number'] = '<a href="javascript:GO.exactonline.downloadSalesInvoice(\''.$projectModel->id.'\',\''.$incomeAttributes['invoice_number'].'\')">'.$incomeAttributes['invoice_number'].'</a>';
		
		$project2IncomeExtension = Project2IncomeExtension::model()->findByPk($incomeAttributes['id']);
		if(!empty($project2IncomeExtension->open_fee)) {
			$incomeAttributes['open_fee'] = \GO::user()->currency.' '.\GO\Base\Util\Number::localize($project2IncomeExtension->open_fee);
		} else {
			$incomeAttributes['open_fee'] = ' ';
		}
		
		if(!empty($project2IncomeExtension->invoice_id)) {
			$incomeAttributes['add_to_exact'] = 'Yes';
		} else {
			$incomeAttributes['add_to_exact'] = 'No';
		}
		
	}
	
	
	public static function beforeDbStoreIncomeController(&$columnModel, &$findParams) {
		
		$findParams->joinModel(array(
				'model'=>'GO\Exactonline\Model\Project2IncomeExtension',
				'localTableAlias'=>'t', //defaults to "t"
				'localField'=>'id', //defaults to "id"
				'foreignField'=>'income_id', //defaults to primary key of the remote model
				'tableAlias'=>'incomeExtension', //Optional table alias
				'type'=>'LEFT' //defaults to INNER
			));
		$params = $findParams->getParams();
		$findParams->select($params['fields'].',incomeExtension.invoice_id');
		
		
		$columnModel->formatColumn('add_to_exact', '!empty($model->invoice_id)?"Yes":"No"');
		
		
	}

	

	public static function submitApiSettings(&$settingsController, &$response, &$params) {
		$settings = GO\Exactonline\Model\Settings::load();
		$settings->saveFromArray($params);
		$data = $settings->getArray();
		
		$response['data']=array_merge($response['data'],$data);
	}
	
	
	public static function loadApiSettings(&$settingsController, &$response, &$params) {
		$settings = GO\Exactonline\Model\Settings::load();
		$data = $settings->getArray();
		$response['data']=array_merge($response['data'],$data);
	}
	
}