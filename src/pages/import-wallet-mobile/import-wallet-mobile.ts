import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading } from 'ionic-angular';
import { MvsServiceProvider } from '../../providers/mvs-service/mvs-service';
import { AppGlobals } from '../../app/app.global';
import { TranslateService } from '@ngx-translate/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { WalletServiceProvider } from '../../providers/wallet-service/wallet-service';
import { AlertProvider } from '../../providers/alert/alert';

@IonicPage()
@Component({
    selector: 'page-import-wallet-mobile',
    templateUrl: 'import-wallet-mobile.html',
})
export class ImportWalletMobilePage {

    loading: Loading;
    qrCodeLoaded: boolean = false
    seed: string

    constructor(
        public nav: NavController,
        private globals: AppGlobals,
        public navParams: NavParams,
        private mvs: MvsServiceProvider,
        private wallet: WalletServiceProvider,
        private translate: TranslateService,
        private barcodeScanner: BarcodeScanner,
        private alert: AlertProvider,
    ) {
        this.qrCodeLoaded = false;
    }

    passwordValid = (password) => (password) ? password.length > 0 : false;

    scan() {
        let wallet = {};
        this.translate.get(['SCANNING.MESSAGE_ACCOUNT']).subscribe((translations: any) => {
            this.barcodeScanner.scan(
                {
                    preferFrontCamera: false, // iOS and Android
                    showFlipCameraButton: false, // iOS and Android
                    showTorchButton: false, // iOS and Android
                    torchOn: false, // Android, launch with the torch switched on (if available)
                    prompt: translations['SCANNING.MESSAGE_ACCOUNT'], // Android
                    resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                    formats: "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
                }).then((result) => {
                    if (!result.cancelled) {
                        let content = result.text.toString().split('&')
                        this.seed = content[0]
                        if (content.length != 3) {
                            this.alert.showError('IMPORT_QRCODE', '')
                        } else {
                            this.globals.getNetwork()
                                .then((network) => {
                                    if (content[1] != network.charAt(0)) {
                                        this.alert.showError('MESSAGE.NETWORK_MISMATCH', '')
                                    } else {
                                        wallet = { "index": Math.max(5, Math.min(parseInt(content[2]), 50)) }
                                        this.wallet.setWallet(wallet)
                                        this.wallet.setMobileWallet(content[0]).then(() => this.qrCodeLoaded = true)
                                    }
                                })
                        }
                    }
                })
        })
    }

    decrypt(password, seed) {
        this.alert.showLoading()
        this.wallet.setMobileWallet(seed)
            .then(() => Promise.all([this.wallet.getWallet(password), this.wallet.getAddressIndex()]))
            .then((results) => this.wallet.generateAddresses(results[0], 0, results[1]))
            .then((addresses) => this.mvs.setAddresses(addresses))
            .then(() => this.wallet.saveSessionAccount(password))
            .then(() => this.nav.setRoot("LoadingPage", { reset: true }))
            .catch((e) => {
                console.error(e);
                this.alert.showError('MESSAGE.PASSWORD_WRONG', '');
                this.alert.stopLoading()
            });
    }

    howToMobile = () => this.nav.push("HowToMobilePage")

}
