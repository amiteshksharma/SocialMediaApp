import React from 'react';
import Cropper from 'react-easy-crop'
 
class Crop extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        image: props.url,
        crop: { x: 0, y: 0 },
        zoom: 1,
        aspect: 4 / 3,
      }

      this.onCropChange = this.onCropChange.bind(this);
      this.onCropComplete = this.onCropComplete.bind(this);
      this.onZoomChange = this.onZoomChange.bind(this);
  }
 
  onCropChange = crop => {
    this.setState({ crop })
  }
 
  onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels)
  }
 
  onZoomChange = zoom => {
    this.setState({ zoom })
  }
 
  render() {
    return (
      <Cropper
        image={this.state.image}
        crop={this.state.crop}
        zoom={this.state.zoom}
        aspect={this.state.aspect}
        onCropChange={this.onCropChange}
        onCropComplete={this.onCropComplete}
        onZoomChange={this.onZoomChange}
      />
    )
  }
}

export default Crop;