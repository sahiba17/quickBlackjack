import { LoaderScene } from './preloader/loadingScreen';
import { Manager } from './scene/sceneManager';

Manager.initialize(1280, 720, 0x002400);

const loaderScreen: LoaderScene = new LoaderScene();
Manager.changeScene(loaderScreen);

