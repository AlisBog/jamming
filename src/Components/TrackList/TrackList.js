import React, { Component } from 'react';
import './TrackList.css';
import Track from '../Track/Track';

export class TrackList extends Component {
    render() {
        return (
            <div className="TrackList">
                {
                    this.props.tracks.map(track => 
                        <Track track={track}
                            key={track.id}
                            onAdd={this.props.onAdd}
                            onRemove={this.props.onRemove}
                            isRemoval={this.props.isRemoval}
                            />)
                }
            </div>
        )
    }
}

export default TrackList