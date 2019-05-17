let MConfig = {
    needCheckBeforeUpdate:false,
    needUpdate:false,
    continueIfFailedUpdate:true,
    urlServices:"http://192.168.1.11",
    portServices:"8001",
    gameName:"game_test",
    ads:{
        unity:{
            reward:[
                'rewardVideo',
                "video"
            ],
            placement:'placement',
            interstitial:'interstitial_test',
            banner:'banner_test'
        },
        adMod:{
            reward:'watch_reward',
            interstitial:'all_scene_intermediary',
            banner:'bottom_banner'
        }
    }
};

window.MConfig = MConfig;