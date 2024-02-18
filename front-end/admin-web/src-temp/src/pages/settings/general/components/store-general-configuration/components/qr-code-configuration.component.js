import { Button, Card } from "antd";
import { DownloadQR, QRWarning } from "constants/icons.constants";
import { forwardRef, useEffect, useState } from "react";
import "../store-general-configuration.style.scss";
import { QRCode } from 'react-qrcode-logo';
import { useSelector } from "react-redux";
import { env } from "../../../../../../env";
import fileDataService from "../../../../../../data-services/file/file-data.service";
import { useHistory } from "react-router-dom";
import packageDataService from "../../../../../../data-services/package/package-data.service";
import goFnbLogo from "../../../../../../assets/images/go-fnb-login-logo.png";

export const QRCodeConfiguration = forwardRef((props, ref) => {
	const { t, className } = props;
	const [storeInfo, setStoreInfo] = useState({});
	const [logo, setLogo] = useState();
	const [storeAppAvailable, setStoreAppAvailable] = useState(false);
	const reduxState = useSelector((state) => state);
	const history = useHistory();
	const bgColor = '#f7f5ff';
	const logoPadding = 10;
	const offset = 0;
	const size = 272;
	const logoRadius = 34;
	const logoWidth = 60;
	const logoHeight = 60;

	const pageData = {
		title: t("store.qrCodeConfiguration.title"),
		description: t("store.qrCodeConfiguration.description"),
		downloadImage: t("store.qrCodeConfiguration.downloadImage"),
		warningText: t("store.qrCodeConfiguration.warningText"),
		seePlans: t("store.qrCodeConfiguration.seePlans"),
	};

	useEffect(() => {
		const info = reduxState?.session?.informationPublishStore;
		setStoreInfo(info);
	}, [reduxState?.session?.informationPublishStore]);

	useEffect(() => {
		if (storeInfo?.logo && storeInfo?.logo?.length > 0) {
			void getBase64Image(storeInfo?.logo);
		} else {
			setLogo(undefined);
		}
	}, [storeInfo]);

	const getBase64Image = async(url) => {
		const res = await fileDataService.getBase64Image(url);
		if (res?.imageData) {
			setLogo(res?.imageData);
		}
	}

	useEffect(() => {
		void checkStoreAppAvailable();
	}, [storeInfo]);

	const checkStoreAppAvailable = async() => {
		const res = await packageDataService.checkStoreAppAvailable();
		if (res?.isAvailable) {
			setStoreAppAvailable(res?.isAvailable);
		}
	}

	const handleDownload = () => {
		const canvas = document.getElementById("react-qrcode-logo");
		if (canvas) {
			const url = canvas?.toDataURL("image/png");
			const link = document.createElement('a');
			link.download = 'download-app-qr-code.png';
			link.href = url;
			link.click();
		}
	};

	const onOpenMyAccount = () => {
		const defaultTab = {
			key: 2,
		};

		history.push({
			pathname: '/my-account',
			state: defaultTab,
		});
	};

	useEffect(() => {
		const canvas = document.getElementById('react-qrcode-logo');
		if (canvas && logo) {
			const ctx = canvas.getContext('2d');
			const image = new Image();

			const roundedImage = (x, y, width, height, radius) => {
				ctx.beginPath();
				ctx.moveTo(x + radius, y);
				ctx.lineTo(x + width - radius, y);
				ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
				ctx.lineTo(x + width, y + height - radius);
				ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
				ctx.lineTo(x + radius, y + height);
				ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
				ctx.lineTo(x, y + radius);
				ctx.quadraticCurveTo(x, y, x + radius, y);
				ctx.closePath();
			}

			image.onload = () => {
				ctx.save();

				const dWidthLogo = logoWidth;
				const dHeightLogo = logoHeight;
				const dxLogo = ((size - dWidthLogo) / 2);
				const dyLogo = ((size - dHeightLogo) / 2);

				ctx.beginPath()
				ctx.arc(size/2, size/2, dWidthLogo/2 + logoPadding, 0, Math.PI*2, false);
				ctx.arc(size/2, size/2, 0, 0, Math.PI*2, true);
				ctx.strokeStyle = bgColor;
				ctx.fillStyle = bgColor;
				ctx.fill();

				roundedImage(dxLogo, dyLogo, dWidthLogo, dHeightLogo, logoRadius)
				ctx.clip();
				ctx.drawImage(image, dxLogo, dyLogo, dWidthLogo, dHeightLogo);

				ctx.restore();
			};
			image.src = logo;
		}
	}, [logo]);

	return (
		<div className={className}>
			<Card className="card-qr-code">
				<p className="card-qr-code text-title">
					{pageData.title}
				</p>
				<p className="card-qr-code text-description">
					{pageData.description}
				</p>
				{!storeAppAvailable ?
					<div className='card-qr-code qr-warning'>
						<QRWarning />
						<p className="qr-warning-text">
							<center>{pageData.warningText}</center>
						</p>
						<div onClick={() => onOpenMyAccount()} className="qr-warning-link">
							<a><center>{pageData.seePlans}</center></a>
						</div>
					</div> :
					<div className='card-qr-code qr-code'>
						<div className='card-qr-code qr-code qr-code-wrapper'>
							{storeInfo?.logo && storeInfo?.logo?.length > 0 && logo ?
							<QRCode
								size={size}
								quietZone={offset}
								bgColor={bgColor}
								value={`${env.REACT_APP_ROOT_DOMAIN}/api/file/get-download-link/${storeInfo?.id}`}
							/> :
							<QRCode
								size={size}
								quietZone={offset}
								logoPadding={logoPadding}
								bgColor={bgColor}
								logoPaddingStyle={'circle'}
								removeQrCodeBehindLogo={true}
								value={`${env.REACT_APP_ROOT_DOMAIN}/api/file/get-download-link/${storeInfo?.id}`}
								logoImage={goFnbLogo}
							/>}
						</div>
						<Button
							icon={<DownloadQR />}
							className={'card-qr-code qr-code download-qr-btn'}
							onClick={handleDownload}
						>
							{pageData.downloadImage}
						</Button>
					</div>
				}
			</Card>
		</div>
	);
});
