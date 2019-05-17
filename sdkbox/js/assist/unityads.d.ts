declare module sdkbox {     module PluginUnityAds {        /**        *  initialize the plugin instance.        */        export function init() : boolean;
        /**        * Set listener to listen for inmobi events        */        export function setListener(listener : object) : object;
        /**        * Get the listener        */        export function getListener() : object;
        /**        * Remove the listener, and can't listen to events anymore        */        export function removeListener() : object;
        export function isSupported() : boolean;
        export function isReady(placementId : string) : boolean;
        export function show(placementId : string) : object;
        export function getPlacementState(placementId : string) : number;
        /**        * Enable GDPR        */        export function setGDPR(enabled : boolean) : object;
        export function setServerId(sid : string) : object;
    }     module UnityAdsListener {        export function unityAdsDidClick(placementId : string) : object;
        export function unityAdsPlacementStateChanged(placementId : string , oldState : object , newState : object) : object;
        export function unityAdsReady(placementId : string) : object;
        export function unityAdsDidError(error : object , message : string) : object;
        export function unityAdsDidStart(placementId : string) : object;
        export function unityAdsDidFinish(placementId : string , state : object) : object;
    }}