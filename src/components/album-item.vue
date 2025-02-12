<template>

<div class="s-box"> 
    <div class="s-spiral"></div>
    <a v-bind:href='"show?apath="+encodeURIComponent(aPath)'>
        <div class="s-square">
            <img class="s-album-image" v-bind:src='albumImageUrl'
            />
        </div>
    </a>
    <div class="s-oneline s-title">
        {{name}}
    </div>
    <div class="s-subtitle s-oneline">
        {{dateString}}
    </div>
    <div class="right s-action-menu">
        <NcActions default-icon="icon-shared" :force-menu="true" v-bind:style='(isShared) ? "opacity: 1" : "opacity: 0.3"'>
            <NcActionButton icon="icon-shared" @click="toggleShare" v-if="!(isShared)">Share album</NcActionButton>
            <NcActionLink icon="icon-external" v-bind:href="shareUrl" target="_blank" v-if="isShared" v-on:click="copyShareUrlToClipboard">Link to public album</NcActionLink>
            <NcActionButton icon="icon-delete" @click="toggleShare" v-if="isShared" :close-after-click="true">Remove share</NcActionButton>
        </NcActions>
        <NcActions default-icon="icon-delete" :force-menu="true">
            <NcActionButton icon="icon-error" @click="deleteAlbum">CONFIRM ALBUM DELETION</NcActionButton>
        </NcActions>
    </div>
    <input type="text"  style="display: none" v-bind:value="shareUrl"/>
    <textarea style="display: none; height: 0px" v-model="shareUrl" v-bind:id='"input-"+aPath'></textarea>
</div>

</template>

<script>

import { NcActionLink, NcActionButton, NcActions } from '@nextcloud/vue'
import { generateUrl, imagePath } from '@nextcloud/router'

export default {
    props: {
        'shares': Array,
        'aPath': String,
        'albumImagePath': String,
        'name': String,
        'date': String,
        'albumId': String,
    },
    components: {
        NcActions,
        NcActionButton,
        NcActionLink
    },
    computed: {
        "isShared": function() {
            return (this.shares.find(share => {
                    return share['albumId'] == this.albumId
                }) != undefined);
        },
        "dateString": function() {
            moment.locale(window.navigator.language);
            return moment(this.date, "YYYYMMDDhhmmss").format("LL");
        },
        "shareToken": function() {
            if (this.isShared) {
                return this.shares.find(share => {
                    return share['albumId'] == this.albumId
                }).token;
            }
            return "";
        },
        "shareUrl": function() {
            if (this.shareToken != "") {
                return window.location.protocol + '//' + window.location.host + generateUrl('/apps/souvenirs/public/'+this.shareToken);
            }
            return "";
        },
        "albumImageUrl": function() {
            if (this.albumImagePath == "") {
                return imagePath("souvenirs","album_image.png");
            } else {
                return "preview?apath="+encodeURIComponent(this.aPath)+"&file="+this.albumImagePath.replace(/.*\//,"")+"&width=256&height=256";
            }
        }
    },
    methods: {
        'deleteAlbum': function() {
            var that = this;
            fetch("apiv2/album/"+this.albumId, {
                headers: {
                    'requesttoken': OC.requestToken,
                },
                method: "DELETE",
                })
            .then(response => {
                that.$emit("snackbar","Album deleted.");
                that.$emit('refresh-albums');
            }).catch(error => {
                console.log("Error in deleting album.");
            });
            event.preventDefault();
        },
        'toggleShare': function(event) {
            if (this.isShared) {
                this.deleteShare();
            } else {
                this.createShare();
            }
            event.preventDefault();
        },
        'deleteShare': function() {
            if (this.isShared) {
                var that = this;
                var token = this.shares.find(share => {
                    return share['albumId'] == this.albumId
                }).token;
                fetch("apiv2/share/"+token, {
                    headers: {
                        'requesttoken': OC.requestToken,
                    },
                    method: "DELETE",
                    })
                .then(response => {
                    that.$emit('refresh-shares');
                    that.$emit("snackbar","Album share removed.");
                }).catch(error => {
                    console.log("Error in deleting share.");
                });
            }
        },
        'createShare': function() {
            if (!this.isShared) {
                var that = this;
                fetch("apiv2/share", {
                    headers: {
                        'requesttoken': OC.requestToken,
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({'albumId': this.albumId})
                    })
                .then(response => {
                    that.$emit('refresh-shares');
                }).catch(error => {
                    console.log("Error in creating share.");
                });
            }
        },
        'copyShareUrlToClipboard': function() {
            navigator.clipboard.writeText(this.shareUrl).then(function() {
                this.$emit("snackbar","Album shared. Public URL copied to clipboard.");
            }, function() {
                this.$emit("snackbar","Clipboard error!");
            });
        }
    },
}


</script>

<style scoped>
.s-spiral {
	background-image: url('./img/spiral.svg');
	background-repeat: repeat-y;
	background-size: 20px;
	width: 20px;
	height: 100%;
	position: absolute;
	top: 0;
	left: -10px;
}

.s-subtitle {
	font-style: italic;
	padding-left: 20px;
}

.s-oneline {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.s-title {
	font-weight: bold;
	font-size: 200%;
	line-height: 200%;
}

.s-box {
	display: inline-block;
	border-width: 2px;  
	border-color: var(--color-border);
	border-style: solid;
	width: 300px;
	margin: 20px;
	padding: 20px;
	position: relative;
}
.s-box:hover {
	box-shadow: 5px 5px var(--color-box-shadow);
}

.s-square {
	padding-top: 100%;
	position: relative;
}

.s-album-image {
	object-fit: cover;
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0px;
	left: 0px;
}

.s-action-menu {
    display: inline;
}

.right {
    float: right;
}
</style>
