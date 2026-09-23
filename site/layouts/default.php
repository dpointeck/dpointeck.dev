<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= $page->title()->esc() ?></title>
  <?= css('assets/css/style.css') ?>
</head>
<body>
  <?= $slot ?>
</body>
</html>
