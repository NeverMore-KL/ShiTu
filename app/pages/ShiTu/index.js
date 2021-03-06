/**
 * @flow
 * Created by Rabbit on 2018/4/12.
 */

import React, {Component} from 'react';
import {
	StyleSheet,
	Text,
	View,
	ImageBackground,
	StatusBar,
	NativeModules, DeviceInfo
} from 'react-native';

// const InterestQQ = NativeModules.InterestQQ;

// import * as QQ from 'react-native-qqsdk';
// import * as QQ from 'react-native-interest-qq';


import {ShiTuMobx} from '../../mobx/ShiTu';

import { GradientButton } from '../../components';
import BaseContainer from '../../components/BaseContainer';
import { System } from '../../utils';
import {observer, inject} from 'mobx-react';
import {PowerStore} from '../../store/PowerStore';

import * as Animatable from 'react-native-animatable';
const AnimationButton = Animatable.createAnimatableComponent(GradientButton);
const AnimationImageBackground = Animatable.createAnimatableComponent(ImageBackground);

import {ActionSheet, Theme} from 'teaset';
import * as ImagePicker from 'react-native-image-picker';
import {ConfigStore} from '../../store/ConfigStore';
import type {NavigationScreenProp} from 'react-navigation';

type Props = {
  navigation: NavigationScreenProp<*>,
	powerStore: PowerStore;
	configStore: ConfigStore;
};

@inject('configStore', 'powerStore')
@observer
class ShiTu extends Component<Props> {

	shiTuMobx: ShiTuMobx;

	constructor(props: Props) {
		super(props);
		this.shiTuMobx = new ShiTuMobx();
	}

	componentDidMount() {
		console.log('statusBarHeight', Theme.statusBarHeight);
		console.log('navBarContentHeight', Theme.navBarContentHeight);
	}

	selectedImagePicker = (type: string) => {

		const options = {
			quality: 0.5,
			allowsEditing: false,
			noData: true,
			storageOptions: {
				skipBackup: true,
				path: 'ShiTu'
			}
		};

		const launchType = `launch${type}`;

		ImagePicker[launchType](options, async(imageResponse)  => {
			console.log('imageResponse', imageResponse);

			this.props.configStore.showLoading();

			const imageData = await this.shiTuMobx.uploadImage(imageResponse);

			console.log('imageData', imageData);

			const params = {
				token: imageData.key,
			};

			const searchDetail = await this.shiTuMobx.getSearchDetail(params);

			this.props.configStore.hideLoading();

			this.props.navigation.navigate('WebView', {uri: searchDetail.data.webURL});

		});

	}

	openImagePicker = async () => {

		// console.log('NativeModules', NativeModules.InterestQQ);

		// NativeModules.InterestQQ.ssoLogin()
		// 	.then(() => { console.log('Installed'); })
		// 	.catch(() => { console.log('not installed'); });
		//
		// NativeModules.InterestQQ.testPrint("Jack", {
		// 	height: '1.78m',
		// 	weight: '7kg'
		// });
		//
		// NativeModules.InterestQQ.checkClientInstalled()
		// 	.then(result => {
		// 		console.log('result', result);
		// 	})
		// 	.catch(e => {
		// 		console.log('e', e);
		// 	});



		// QQ.shareText('分享文字',QQ.shareScene.QQ)
		// 	.then((result)=>{console.log('result is', result)})
		// 	.catch((error)=>{console.log('error is', error)});

		// UMShare.authLogin(SharePlatform.QQ, (result) => {
		// 	console.log(result);
		// 	// code: 0成功、1失败、2取消
		// 	if(result.code === 0) {
		// 		console.log('授权登录成功:' +
		// 			'userId: ' + result.uid +QQShareType
		// 			'accessToken: ' + result.accessToken +
		// 			'userName: ' + result.userName +
		// 			'userGender: ' + result.userGender +
		// 			'userAvatar: ' + result.userAvatar
		// 		);
		// 	} else {
		// 		// TODO...
		// 	}
		// });

		const items = [
			{
				title: '拍照',
				onPress: () => this.selectedImagePicker('Camera')
			},
			{
				title: '选择相册',
				onPress: () => this.selectedImagePicker('ImageLibrary')
			},
		];
		const cancelItem = {title: '取消'};
		ActionSheet.show(items, cancelItem);
	}

	render() {
		return (
			<BaseContainer title={'识兔'} isTopNavigator={true}>
				<AnimationImageBackground style={styles.container}
					animation="fadeIn"
					source={{uri: this.props.powerStore.ShiTuBackgroundImage}}
					blurRadius={System.Android ? 5 : 5}
				>
					<AnimationButton
						title={'点我寻找!'}
						animation="bounceInLeft"
						useNativeDriver
						titleStyle={styles.buttonTitle}
						gradientStyle={styles.button}
						onPress={this.openImagePicker}
						btnStyle={styles.btnStyle}
					/>
				</AnimationImageBackground>
			</BaseContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
	},
	button: {
		borderRadius: 5,
	},
	btnStyle: {
		padding: 10,
		shadowColor: 'rgba(0, 0, 0, 0.15)',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowRadius: 3,
		shadowOpacity: 1,
		elevation: 2,
	},
	buttonTitle: {
		color: 'white',
		fontSize: 16,
	}
});

export {ShiTu};
