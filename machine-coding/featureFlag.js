const SAMPLE_FEATURES = {
    show_dialog_box: true,
    enable_new_pricing: true,
};
function getFeatureState(featureName, defaultValue) {
    // write your solution here
    const value = SAMPLE_FEATURES[featureName];
    return new Promise((resolve) => {
        if (value) {
            resolve(value);
        } else {
            reject(defaultValue)
        }
    })
}

getFeatureState("show_dialog_box", false).then((res) => {
    if (res) {
        console.log("flag is true")
    }
}).catch((e) => {
    console.log('flag is false')
})