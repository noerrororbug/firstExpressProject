/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50553
Source Host           : localhost:3306
Source Database       : t1

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2019-11-20 14:05:42
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for actions
-- ----------------------------
DROP TABLE IF EXISTS `actions`;
CREATE TABLE `actions` (
  `aid` int(2) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` int(1) NOT NULL,
  `gid` int(2) NOT NULL,
  `aicon` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`aid`),
  KEY `gid` (`gid`),
  CONSTRAINT `actions_ibfk_1` FOREIGN KEY (`gid`) REFERENCES `groups` (`gid`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of actions
-- ----------------------------
INSERT INTO `actions` VALUES ('1', '/admin/plan/yearplan', '新建年度需求计划', '1', '1', 'glyphicon glyphicon-folder-open');
INSERT INTO `actions` VALUES ('2', '/admin/plan/monthplan', '新建月度需求计划', '1', '1', 'glyphicon glyphicon-folder-open');
INSERT INTO `actions` VALUES ('3', '/admin/plan/urgentplan', '新建紧急需求计划', '1', '1', 'glyphicon glyphicon-folder-open');
INSERT INTO `actions` VALUES ('4', '/admin/plan/approval', '需求审批', '2', '7', 'glyphicon glyphicon-folder-open');
INSERT INTO `actions` VALUES ('6', '/admin/plan/planlist', '需求计划查询', '1', '1', 'glyphicon glyphicon-folder-open');
INSERT INTO `actions` VALUES ('7', '/admin/admin/pri', '查看角色权限', '3', '3', 'glyphicon glyphicon-folder-open');
INSERT INTO `actions` VALUES ('8', '/admin/user/userlist', '查看用户（可以修改）', '2', '2', 'glyphicon glyphicon-folder-open');
INSERT INTO `actions` VALUES ('9', '/admin/user/useradd', '增加用户', '2', '2', 'glyphicon glyphicon-folder-open');
INSERT INTO `actions` VALUES ('10', '/admin/plan/sum', '需求计划汇总', '0', '6', 'glyphicon glyphicon-folder-open');
INSERT INTO `actions` VALUES ('11', '/admin/supplier/suplist', '供应商列表', '0', '5', 'glyphicon glyphicon-folder-open');
INSERT INTO `actions` VALUES ('12', '/admin/supplier/materiallist', '物料列表', '0', '8', 'glyphicon glyphicon-folder-open');
INSERT INTO `actions` VALUES ('13', '/admin/admin/departadd', '增加部门', '0', '4', 'glyphicon glyphicon-folder-open');

-- ----------------------------
-- Table structure for depart
-- ----------------------------
DROP TABLE IF EXISTS `depart`;
CREATE TABLE `depart` (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of depart
-- ----------------------------
INSERT INTO `depart` VALUES ('1', '仓库');
INSERT INTO `depart` VALUES ('2', '财务部');
INSERT INTO `depart` VALUES ('3', '生产部');
INSERT INTO `depart` VALUES ('4', '销售部');
INSERT INTO `depart` VALUES ('7', 'jbjbjk');
INSERT INTO `depart` VALUES ('8', '5ergdgj');

-- ----------------------------
-- Table structure for groups
-- ----------------------------
DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `gid` int(2) NOT NULL,
  `gicon` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of groups
-- ----------------------------
INSERT INTO `groups` VALUES ('1', 'glyphicon glyphicon-folder-open', '需求计划管理');
INSERT INTO `groups` VALUES ('2', 'glyphicon glyphicon-folder-open', '用户管理');
INSERT INTO `groups` VALUES ('3', 'glyphicon glyphicon-folder-open', '权限管理');
INSERT INTO `groups` VALUES ('4', 'glyphicon glyphicon-folder-open', '部门管理');
INSERT INTO `groups` VALUES ('5', 'glyphicon glyphicon-folder-open', '供应商管理');
INSERT INTO `groups` VALUES ('6', 'glyphicon glyphicon-folder-open', '需求汇总管理');
INSERT INTO `groups` VALUES ('7', 'glyphicon glyphicon-folder-open', '需求审批管理');
INSERT INTO `groups` VALUES ('8', 'glyphicon glyphicon-folder-open', '物料管理');

-- ----------------------------
-- Table structure for material
-- ----------------------------
DROP TABLE IF EXISTS `material`;
CREATE TABLE `material` (
  `mcode` varchar(20) NOT NULL,
  `mname` varchar(20) DEFAULT NULL,
  `classcode` varchar(20) NOT NULL,
  `danwei` varchar(10) NOT NULL,
  PRIMARY KEY (`mcode`),
  KEY `classcode` (`classcode`),
  CONSTRAINT `material_ibfk_1` FOREIGN KEY (`classcode`) REFERENCES `mclass` (`classcode`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of material
-- ----------------------------
INSERT INTO `material` VALUES ('s100202003', '打印纸', 's100202', '包');
INSERT INTO `material` VALUES ('s100203001', '篮球', 's100203', '个');
INSERT INTO `material` VALUES ('s100203002', '足球', 's100203', '个');
INSERT INTO `material` VALUES ('s100204001', '牙膏', 's100204', '支');
INSERT INTO `material` VALUES ('s100204002', '牙刷', 's100204', '支');
INSERT INTO `material` VALUES ('s100204003', '杯子', 's100204', '个');
INSERT INTO `material` VALUES ('s100204004', '被子', 's100204', '床');

-- ----------------------------
-- Table structure for mclass
-- ----------------------------
DROP TABLE IF EXISTS `mclass`;
CREATE TABLE `mclass` (
  `classcode` varchar(20) NOT NULL,
  `classname` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`classcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of mclass
-- ----------------------------
INSERT INTO `mclass` VALUES ('s100202', '办公用品');
INSERT INTO `mclass` VALUES ('s100203', '体育用品');
INSERT INTO `mclass` VALUES ('s100204', '生活用品');

-- ----------------------------
-- Table structure for ms
-- ----------------------------
DROP TABLE IF EXISTS `ms`;
CREATE TABLE `ms` (
  `sid` int(10) NOT NULL,
  `mcode` varchar(20) NOT NULL,
  KEY `sid` (`sid`),
  KEY `mcode` (`mcode`),
  CONSTRAINT `ms_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `supplier` (`sid`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `ms_ibfk_2` FOREIGN KEY (`mcode`) REFERENCES `material` (`mcode`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ms
-- ----------------------------
INSERT INTO `ms` VALUES ('2', 's100202003');

-- ----------------------------
-- Table structure for process
-- ----------------------------
DROP TABLE IF EXISTS `process`;
CREATE TABLE `process` (
  `demandid` varchar(30) NOT NULL,
  `uid` int(10) NOT NULL,
  `time` varchar(12) NOT NULL,
  `opinion` varchar(255) DEFAULT NULL,
  `explains` varchar(255) DEFAULT NULL,
  KEY `demandid` (`demandid`),
  CONSTRAINT `process_ibfk_1` FOREIGN KEY (`demandid`) REFERENCES `xuqiu` (`demandid`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of process
-- ----------------------------
INSERT INTO `process` VALUES ('20191111100002', '10086', '2019-11-19', '审批通过', '');
INSERT INTO `process` VALUES ('20191111100002', '12345', '2019-11-19', '审批通过', '');
INSERT INTO `process` VALUES ('20191111100002', '12345', '2019-11-19', '', '修改计划');

-- ----------------------------
-- Table structure for rg
-- ----------------------------
DROP TABLE IF EXISTS `rg`;
CREATE TABLE `rg` (
  `rid` int(2) NOT NULL,
  `gid` int(2) NOT NULL,
  KEY `gid` (`gid`),
  KEY `rid` (`rid`),
  CONSTRAINT `rg_ibfk_2` FOREIGN KEY (`gid`) REFERENCES `groups` (`gid`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `rg_ibfk_3` FOREIGN KEY (`rid`) REFERENCES `role` (`rid`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of rg
-- ----------------------------
INSERT INTO `rg` VALUES ('0', '1');
INSERT INTO `rg` VALUES ('0', '6');
INSERT INTO `rg` VALUES ('0', '5');
INSERT INTO `rg` VALUES ('0', '8');
INSERT INTO `rg` VALUES ('1', '1');
INSERT INTO `rg` VALUES ('1', '5');
INSERT INTO `rg` VALUES ('1', '8');
INSERT INTO `rg` VALUES ('2', '1');
INSERT INTO `rg` VALUES ('2', '2');
INSERT INTO `rg` VALUES ('2', '5');
INSERT INTO `rg` VALUES ('2', '7');
INSERT INTO `rg` VALUES ('2', '8');
INSERT INTO `rg` VALUES ('3', '1');
INSERT INTO `rg` VALUES ('3', '2');
INSERT INTO `rg` VALUES ('3', '4');
INSERT INTO `rg` VALUES ('3', '3');
INSERT INTO `rg` VALUES ('3', '5');
INSERT INTO `rg` VALUES ('3', '6');
INSERT INTO `rg` VALUES ('3', '7');
INSERT INTO `rg` VALUES ('3', '8');
INSERT INTO `rg` VALUES ('0', '7');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `rid` int(2) NOT NULL,
  `rname` varchar(255) NOT NULL,
  PRIMARY KEY (`rid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('0', '需求计划员');
INSERT INTO `role` VALUES ('1', '提报员');
INSERT INTO `role` VALUES ('2', '主管');
INSERT INTO `role` VALUES ('3', '经理');

-- ----------------------------
-- Table structure for stock
-- ----------------------------
DROP TABLE IF EXISTS `stock`;
CREATE TABLE `stock` (
  `mcode` varchar(20) NOT NULL,
  `num` int(11) DEFAULT NULL,
  PRIMARY KEY (`mcode`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of stock
-- ----------------------------

-- ----------------------------
-- Table structure for supplier
-- ----------------------------
DROP TABLE IF EXISTS `supplier`;
CREATE TABLE `supplier` (
  `sid` int(10) NOT NULL AUTO_INCREMENT,
  `sname` varchar(20) DEFAULT NULL,
  `phone` int(11) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of supplier
-- ----------------------------
INSERT INTO `supplier` VALUES ('1', '', null, '');
INSERT INTO `supplier` VALUES ('2', '张三', '1234567891', '123@qq.com');
INSERT INTO `supplier` VALUES ('11', 'dfg', '3423', 'dgd');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(10) NOT NULL,
  `password` varchar(255) NOT NULL,
  `uname` varchar(20) DEFAULT NULL,
  `departid` int(2) DEFAULT NULL,
  `rid` int(2) DEFAULT NULL,
  `state` int(1) DEFAULT NULL,
  `createdate` datetime DEFAULT NULL,
  PRIMARY KEY (`uid`),
  KEY `departid` (`departid`),
  KEY `position` (`rid`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`departid`) REFERENCES `depart` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `user_ibfk_2` FOREIGN KEY (`rid`) REFERENCES `role` (`rid`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1000', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'admin', null, '3', '1', '2019-11-02 15:47:48');
INSERT INTO `user` VALUES ('10086', '7c4a8d09ca3762af61e59520943dc26494f8941b', '老李', '1', '2', '1', '2019-11-15 15:48:02');
INSERT INTO `user` VALUES ('12345', '7c4a8d09ca3762af61e59520943dc26494f8941b', '欧普', null, '0', '1', '2019-11-03 23:07:44');
INSERT INTO `user` VALUES ('14723', '7c4a8d09ca3762af61e59520943dc26494f8941b', '王的12', '3', '2', '1', '2019-11-17 13:50:23');
INSERT INTO `user` VALUES ('100010', '7c4a8d09ca3762af61e59520943dc26494f8941b', '小王', '3', '1', '1', '2019-11-16 15:48:06');
INSERT INTO `user` VALUES ('100011', '7c4a8d09ca3762af61e59520943dc26494f8941b', '老王', '3', '2', '1', '2019-11-01 23:06:33');
INSERT INTO `user` VALUES ('565464', '7c4a8d09ca3762af61e59520943dc26494f8941b', '的发给对方', '1', '0', '1', '2019-11-13 14:34:42');
INSERT INTO `user` VALUES ('675758', '7c4a8d09ca3762af61e59520943dc26494f8941b', '王的', '1', '0', '1', '2019-11-13 14:33:24');
INSERT INTO `user` VALUES ('1008611', '7c4a8d09ca3762af61e59520943dc26494f8941b', '小李', '1', '1', '1', '2019-11-08 15:47:55');
INSERT INTO `user` VALUES ('1488555', '7c4a8d09ca3762af61e59520943dc26494f8941b', '王的', '4', '0', '1', '2019-11-13 14:27:40');
INSERT INTO `user` VALUES ('5646456', '7c4a8d09ca3762af61e59520943dc26494f8941b', '王的', '3', '0', '1', '2019-11-13 14:29:41');
INSERT INTO `user` VALUES ('34235634', '7c4a8d09ca3762af61e59520943dc26494f8941b', '王的', '2', '0', '1', '2019-11-13 14:32:27');

-- ----------------------------
-- Table structure for xuqiu
-- ----------------------------
DROP TABLE IF EXISTS `xuqiu`;
CREATE TABLE `xuqiu` (
  `demandid` varchar(30) NOT NULL,
  `xqtype` varchar(10) NOT NULL,
  `dingdantype` varchar(10) NOT NULL,
  `author` int(10) NOT NULL,
  `createTime` varchar(12) NOT NULL,
  `yusuannei` varchar(5) DEFAULT NULL,
  `classcode` varchar(20) NOT NULL,
  `classname` varchar(20) NOT NULL,
  `mcode` varchar(20) NOT NULL,
  `mname` varchar(20) NOT NULL,
  `guige` varchar(255) NOT NULL,
  `xuqiurenyuan` varchar(255) DEFAULT NULL,
  `xuqiuname` varchar(255) NOT NULL,
  `xinhao` varchar(255) NOT NULL,
  `danwei` varchar(255) NOT NULL,
  `xuqiunum` int(11) NOT NULL,
  `month` varchar(7) NOT NULL,
  `xuqiudate` varchar(12) NOT NULL,
  `huoyuan` varchar(5) NOT NULL,
  `qiwangsid` int(10) DEFAULT NULL,
  `gudinsid` int(10) DEFAULT NULL,
  `xuqiubumen` int(2) NOT NULL,
  `beizhu` varchar(255) DEFAULT NULL,
  `zhuizhongma` varchar(255) NOT NULL,
  `state` int(1) unsigned zerofill NOT NULL DEFAULT '0',
  `xuqiustate` varchar(10) NOT NULL,
  `changeID` int(10) DEFAULT NULL,
  `changeTime` varchar(12) DEFAULT NULL,
  `cyuanyin` varchar(255) DEFAULT NULL,
  `dindsp` int(1) unsigned zerofill DEFAULT NULL,
  `bumenzgsp` int(1) unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`demandid`),
  KEY `author` (`author`),
  KEY `qiwangsid` (`qiwangsid`,`gudinsid`),
  KEY `classcode` (`classcode`),
  KEY `mcode` (`mcode`),
  KEY `gudinsid` (`gudinsid`),
  KEY `xuqiubumen` (`xuqiubumen`),
  CONSTRAINT `xuqiu_ibfk_1` FOREIGN KEY (`classcode`) REFERENCES `mclass` (`classcode`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `xuqiu_ibfk_2` FOREIGN KEY (`mcode`) REFERENCES `material` (`mcode`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `xuqiu_ibfk_3` FOREIGN KEY (`gudinsid`) REFERENCES `supplier` (`sid`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `xuqiu_ibfk_4` FOREIGN KEY (`qiwangsid`) REFERENCES `supplier` (`sid`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `xuqiu_ibfk_5` FOREIGN KEY (`xuqiubumen`) REFERENCES `depart` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xuqiu
-- ----------------------------
INSERT INTO `xuqiu` VALUES ('20191111100002', '年度计划', '否', '1000', '2019-11-15', '是', 's100204', '生活用品', 's100204001', '牙膏', 'a4fgd', '老李', 'e3fgre', '5*5fgf', '支', '21', '2019-08', '2019-11-11', '是', '2', '2', '1', '3e3e修改', '201911111000027126', '0', '自由', '1000', '2019-11-14', 'test修改', '0', '0');
INSERT INTO `xuqiu` VALUES ('20191111100003', '年度计划', '否', '1000', '2019-11-15', '是', 's100203', '体育用品', 's100203002', '足球', 'gg', '老李', 'ffrr', '5*5', '个', '21', '2019-08', '2019-11-11', '是', '2', '1', '1', '', '201911111000038702', '1', '已提交汇总', '0', '', null, '0', '0');
INSERT INTO `xuqiu` VALUES ('20191111100004', '年度计划', '是', '1000', '2019-11-15', '是', 's100204', '生活用品', 's100204001', '牙膏', 'a4', '55', 'test', '5*5', '支', '21', '2019-08', '2019-11-11', '是', '1', '1', '1', '', '201911111000049782', '1', '已提交汇总', '0', '', null, '0', '0');
INSERT INTO `xuqiu` VALUES ('20191111100005', '年度计划', '是', '1000', '2019-11-15', '是', 's100203', '体育用品', 's100203001', '篮球', 'a4', '老李', 'test', 'gg', '个', '21', '2019-08', '2019-11-11', '是', '1', '1', '1', '', '201911111000054829', '1', '已提交汇总', '0', '', null, '0', '0');
INSERT INTO `xuqiu` VALUES ('20191111100006', '年度计划', '是', '1000', '2019-11-15', '是', 's100203', '体育用品', 's100203001', '篮球', 'a4', '老李', 'ffrr', '5*5', '个', '21', '2019-08', '2019-11-11', '是', '1', '1', '1', '', '201911111000068807', '0', '自由', '0', '', null, '0', '0');
INSERT INTO `xuqiu` VALUES ('20191111100007', '年度计划', '是', '1000', '2019-11-17', '是', 's100202', '办公用品', 's100202003', '打印纸', 'a4', '老李', 'ffrr', 'gg', '包', '21', '2019-08', '2019-11-11', '是', '1', '1', '1', '', '201911111000071228', '1', '已提交汇总', null, null, null, '0', '0');

-- ----------------------------
-- View structure for uname_info
-- ----------------------------
DROP VIEW IF EXISTS `uname_info`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `uname_info` AS select `user`.`uid` AS `uid`,`user`.`uname` AS `uname` from `user` ;

-- ----------------------------
-- View structure for userinfo
-- ----------------------------
DROP VIEW IF EXISTS `userinfo`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `userinfo` AS select `user`.`uid` AS `uid`,`role`.`rname` AS `rname`,`user`.`uname` AS `uname`,`depart`.`name` AS `name` from ((`user` left join `depart` on((`user`.`departid` = `depart`.`id`))) join `role`) where (`role`.`rid` = `user`.`rid`) ;
