<?php
$listeners["delete"][]=array("GO\Email\EmailModule", "deleteUser");
$listeners["delete"][]=array("GO\Tasks\TasksModule", "deleteUser");
$listeners["delete"][]=array("GO\Calendar\CalendarModule", "deleteUser");
$listeners["delete"][]=array("GO\Addressbook\AddressbookModule", "deleteUser");
$listeners["save"][]=array("GO\Files\FilesModule", "saveUser");
$listeners["delete"][]=array("GO\Files\FilesModule", "deleteUser");
