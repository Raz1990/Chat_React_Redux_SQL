use chat;

#DROP TABLE `chat`.`users`;

CREATE TABLE `chat`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NULL,
  `age` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`user_name` ASC));
  
  
CREATE TABLE `chat`.`groups` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `group_name` VARCHAR(45) NOT NULL,
  `parent_id` INT NULL,
  PRIMARY KEY (`id`));
  
  
  
CREATE TABLE `chat`.`messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `content` VARCHAR(100) NULL,
  `time` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));


INSERT INTO users VALUES (0,'Raz', 'rrr', 27);

INSERT INTO groups VALUES (0,'Friends', null);

UPDATE users SET name = 'Raz', password = 'rrr' WHERE id = 1;


