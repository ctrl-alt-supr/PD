/* 
    
    Each event in the map and each hero and enemy in the database can contain any number of the following notetag telling the system which poses it has available.
    <pose   name="stand"            // The name that will identify this pose. It should be unique per character and match the suffix of the pose image file on the characters folder.
            offsetY="0"             // The offset for the y axis
            offsetX="0"             // The offset for the x axis
            speed="1"               // The speed multiplier for each frame
            origin="1"               // The starting point of the pose (1) by default
            oneShot="false"         // Wheter the pose should be played only one time from start to finish (true) or keept played on repeat until stopped (false)
            autoStop="false"        // For oneShot poses. If true the pose will stop as soon as the pose has finished played.
            waitOnFirst="false"     // For non autoStopable oneShot poses the character will keep the last played frame once finished until manually stopped. If waitOnFirst is true, it will wait until stopped in the first frame of the pose.
/> 
    Reserved poses are poses that are automatically played on some actions without any kind of scripting or method call by the scripter. In order for this poses to be played they should be
    assigned in the target's notetag field as any other pose using the name of the reserved pose you want to assign as the pose name.

    Available reserved pose names are:
        - walk   -> Plays when the character is moving (unless its dashing and there is a dash animation assigned).
        - dash   -> Plays when the character is dashing.
        - stand  -> Plays when the character has been inactive for a while.
        - jump   -> Plays when the character is jumping
*/


PD=PD||{};
PD.Poses={};
PD.Aliases=PD.Aliases||{};
PD.Poses.StandTime=300;
PD.Poses.Defaults={
    name:null,
    offsetX:0,
    offsetY:0,
    speed:1,
    origin:1,
    oneShot:false,
    autoStop:false,
    waitOnFirst:false,
    pattern:[0,1,0,2]
}
PD.Aliases.Game_CharacterBase=PD.Aliases.Game_CharacterBase || {};
PD.Aliases.Game_CharacterBase.initMembers=Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    PD.Aliases.Game_CharacterBase.initMembers.call(this);
    this.initPoses();
}
Game_CharacterBase.prototype.initPoses = function() {
    this._PDPoses={};
    this._PDPoses.poses=[];
    this._PDPoses.currentPose=null;
    this._PDPoses.originalName=null;
    this._PDPoses.originalIndex=null;
    this._PDPoses.needsRefresh=true;
    this._PDPoses.shots=0;
    this._PDPoses.poseCache={};
}
Game_CharacterBase.prototype.playingPose = function() {
    return this._PDPoses.currentPose;
}
Game_CharacterBase.prototype.getCurrentPoseInfo=function(){
    if(this._PDPoses.currentPose==null) return null;
    return this.getPoseInfo(this._PDPoses.currentPose);
}
Game_CharacterBase.prototype.getPoseInfo=function(poseName){
    var poseInfo=this._PDPoses.poses.filter(function(ps){
        return ps.name==poseName;
    });
    if(poseInfo.length>0){
        return poseInfo[0];
    }
    return null;
}
Game_CharacterBase.prototype.playPose = function(poseName) {
    if(this._PDPoses.originalName!=null && this._PDPoses.originalName!=""){
        var poseInfo=this.getPoseInfo(poseName);
        if(poseInfo!=null){
            this._PDPoses.currentPose=poseName;
            this._characterName=this._PDPoses.originalName+"_"+poseInfo.name;
            this.setPattern(poseInfo.origin);
            this._PDPoses.shots=0;
        }
    }
}
Game_CharacterBase.prototype.stopPose = function() {
    this._PDPoses.currentPose=null;
    if(this._PDPoses.originalName!=null && this._PDPoses.originalName!=""){
        this._characterName=this._PDPoses.originalName;
        //this.resetPattern();
    }
}

Game_CharacterBase.prototype.isPlayingPose = function(poseName) {
    if(poseName==undefined || poseName==null){
        poseName=null;
        return this.playingPose()!=null;
    }
    return this.playingPose()==poseName;
}
PD.Aliases.Game_CharacterBase.update2=Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
    PD.Aliases.Game_CharacterBase.update2.call(this);
    this.refreshPoses();
    this.updateWalkingPose();
    this.updateStandPose();
}
Game_CharacterBase.prototype.updateWalkingPose = function() {
    if(this.isMoving()){
        if(this.hasWalkAnime() && this.hasPose("walk") && ! this.isPlayingPose()){
            this.playPose("walk");
        }
    }else{
        if(this.isPlayingPose("walk") && this.isOriginalPattern() && this._stopCount>1){
            this.stopPose();
        }
    }
}
Game_CharacterBase.prototype.updateStandPose = function() {
    if(this.hasPose("idle")){
        if(this._stopCount>0 && this._stopCount%PD.Poses.StandTime==0){
            if(!this.isPlayingPose()){
                this.playPose("idle");
            }
        }else if(this._stopCount==0){
            if(this.isPlayingPose("idle")){
                this.stopPose();
                this.resetPattern();
            }
        }
    }
}

Game_CharacterBase.prototype.refreshPoses = function() {
    if(this._PDPoses.needsRefresh){
        this._PDPoses.needsRefresh=false;
        this._PDPoses.poses=[];
        this._PDPoses.poseCache={};
        this.parsePosesNotetags();
        this._PDPoses.originalName=this.getEditorOriginalName();
        this._PDPoses.originalIndex=this.getEditorOriginalIndex();
        this.cacheAllPoses();
    }else if(this._PDPoses.originalName!=this.getEditorOriginalName() || this._PDPoses.originalIndex!=this.getEditorOriginalIndex()){
        this._PDPoses.needsRefresh=true;
    }
}
Game_CharacterBase.prototype.hasPose = function(poseName) {
    return this._PDPoses.poses.filter(function(ps){
        return ps.name==poseName;
    }).length>0;
}
Game_CharacterBase.prototype.cacheAllPoses = function() {
    if(this._PDPoses.originalName!=null){
        for (var poseIndex = 0; poseIndex < this._PDPoses.poses.length; poseIndex++) {
            var pos = this._PDPoses.poses[poseIndex];
            this.cachePose(pos.name);
        }
    }
}
Game_CharacterBase.prototype.cachePose = function(poseName) {
    this._PDPoses.poseCache[poseName]=ImageManager.loadCharacter(this._PDPoses.originalName+"_"+poseName);
}
Game_CharacterBase.prototype.getEditorOriginalName = function() {
    //Retrieves the original name for this character as set in the MV editor. Its meant to be overriden for each subclass of character base to return the required one.
    return "";
}
Game_Player.prototype.getEditorOriginalName = function() {
    if($gameParty._actors.length>0){
        return $dataActors[$gameParty.leader()._actorId].characterName;
    }
    this._PDPoses.needsRefresh=true
    return "";
}
Game_Event.prototype.getEditorOriginalName = function() {
    var pag=this.page();
    if(pag!=undefined && pag!=null){
        return pag.image.characterName;
    }
    this._PDPoses.needsRefresh=true
    return "";
}
Game_CharacterBase.prototype.getEditorOriginalIndex = function() {
    //Retrieves the original index for this character as set in the MV editor. Its meant to be overriden for each subclass of character base to return the required one.
    return 0;
}
Game_Player.prototype.getEditorOriginalIndex = function() {
    if($gameParty._actors.length>0){
        return $dataActors[$gameParty.leader()._actorId].characterIndex;
    }
    this._PDPoses.needsRefresh=true
    return 0;
}
Game_Event.prototype.getEditorOriginalIndex = function() {
    var pag=this.page();
    if(pag!=undefined && pag!=null){
        return pag.image.characterIndex;
    }
    this._PDPoses.needsRefresh=true
    return 0;
}
Game_CharacterBase.prototype.getPosesNoteContents = function() {
    //Retrieves the note for pose notetags of this character. Its meant to be overriden for each subclass of character base to return the required one.
    return "";
}
Game_Player.prototype.getPosesNoteContents = function() {
    if($gameParty._actors.length>0){
        return $dataActors[$gameParty.leader()._actorId].note;
    }
    this._PDPoses.needsRefresh=true
    return "";
}
Game_Event.prototype.getPosesNoteContents = function() {
    if(this._eventId!=undefined){
        return $dataMap.events[this._eventId].note;
    }
    this._PDPoses.needsRefresh=true
    return "";
}
try{
    if(Game_TileEvent!=undefined){
        Game_TileEvent.prototype.getPosesNoteContents = function() {
            return window["$dataMap_"+PD.Generator.Parameters.TileEventDBMapId].events[this._dbEventId].note;
        }
        Game_TileEvent.prototype.getEditorOriginalIndex = function() {
            var pag=this.page();
            if(pag!=undefined && pag!=null){
                return pag.image.characterIndex;
            }
            this._PDPoses.needsRefresh=true
            return 0;
        }
        Game_TileEvent.prototype.getEditorOriginalName = function() {
            var pag=this.page();
            if(pag!=undefined && pag!=null){
                return pag.image.characterName;
            }
            this._PDPoses.needsRefresh=true
            return "";
        }
    }
}catch(e){
    console.warn("Game_TileEvent is not defined. PD_Poses is meant to be placed after PD_Generator");
}


try{
    if(Game_ItemEvent!=undefined){
        Game_ItemEvent.prototype.getPosesNoteContents = function() {
            return window["$dataMap_"+PD.Generator.Parameters.ItemEventMapId].events[this._dbEventId].note;
        }
        Game_ItemEvent.prototype.getEditorOriginalIndex = function() {
            var pag=this.page();
            if(pag!=undefined && pag!=null){
                return pag.image.characterIndex;
            }
            this._PDPoses.needsRefresh=true
            return 0;
        }
        Game_ItemEvent.prototype.getEditorOriginalName = function() {
            var pag=this.page();
            if(pag!=undefined && pag!=null){
                return pag.image.characterName;
            }
            this._PDPoses.needsRefresh=true
            return "";
        }
    }
}catch(e){
    console.warn("Game_ItemEvent is not defined. PD_Poses is meant to be placed after PD_Item");
}

Game_CharacterBase.prototype.parsePosesNotetags = function() {
    var theNote=this.getPosesNoteContents();
    var rgx=new RegExp("<\\s*pose\\s+([\\w\\s\\d='\":_\\.\\*\\+-\\{\\}]*?)\\s*\\/?\\s*>", "ig");
    var regexMatch =null
    while((regexMatch=rgx.exec(theNote))!=null){
        var dp=new window.DOMParser().parseFromString(regexMatch[0], "text/xml");
        var ftOpts={};
        for(var propertyName in PD.Poses.Defaults) {
            if(dp.documentElement.attributes[propertyName]!=null){
                if(propertyName=="oneShot" || propertyName=="autoStop" || propertyName=="waitOnFirst"){
                    ftOpts[propertyName]=JSON.parse(dp.documentElement.attributes[propertyName].value);
                }else if(propertyName=="name"){
                    ftOpts[propertyName]=String(dp.documentElement.attributes[propertyName].value);
                }else{
                    //ftOpts[propertyName]=dp.documentElement.attributes[propertyName].value;
                    ftOpts[propertyName]=Number(dp.documentElement.attributes[propertyName].value);
                }
            }else{
                ftOpts[propertyName]=PD.Poses.Defaults[propertyName];
            }
        }
        this._PDPoses.poses.push(ftOpts);
    }
}



Game_CharacterBase.prototype.updateAnimation = function() {
    this.updateAnimationCount();
    if (this._animationCount >= this.animationWait()) {
        this.updatePattern();
        this._animationCount = 0;
    }
};

Game_CharacterBase.prototype.animationWait = function() {
    return (9 - this.realMoveSpeed()) * 3;
};

Game_CharacterBase.prototype.updateAnimationCount = function() {
    var playingPoseInfo=this.getCurrentPoseInfo();
    if(playingPoseInfo!=null){
        this._animationCount+=1*playingPoseInfo.speed;
    }else{
        if (this.isMoving() && this.hasWalkAnime()) {
            this._animationCount += 1.5;
        } else if (this.hasStepAnime() || !this.isOriginalPattern()) {
            this._animationCount++;
        }
    }
};

Game_CharacterBase.prototype.updatePattern = function() {
    var playingPoseInfo=this.getCurrentPoseInfo();
    if(playingPoseInfo!=null){
        this._pattern = (this._pattern + 1) % this.maxPattern();
        //console.log(this._pattern);
    }else{
        if (!this.hasStepAnime() && this._stopCount > 0) {
            this.resetPattern();
        } else {
            this._pattern = (this._pattern + 1) % this.maxPattern();
        }
    }
};

Game_CharacterBase.prototype.maxPattern = function() {
    return 4;
};

Game_CharacterBase.prototype.pattern = function() {
    var playingPoseInfo=this.getCurrentPoseInfo();
    if(playingPoseInfo!=null){
        if(this._pattern>=3){
            this.setPattern(0);
        }
        var nextPattern=(this._pattern+1) % this.maxPattern();
        nextPattern=nextPattern>=3?0:nextPattern;
        if(nextPattern==playingPoseInfo.origin){
            this._PDPoses.shots+=1;
            if(playingPoseInfo.oneShot==true){
                if(playingPoseInfo.autoStop==true){
                    this.stopPose();
                    return this._pattern;
                }else{
                    if(playingPoseInfo.waitOnFirst==true){
                        this.setPattern(playingPoseInfo.origin);
                        return this._pattern;
                    }
                }  
            }
        }
        return this._pattern;
    }
    return this._pattern < 3 ? this._pattern : 1;
};

Game_CharacterBase.prototype.setPattern = function(pattern) {
    this._pattern = pattern;
};

Game_CharacterBase.prototype.isOriginalPattern = function() {
    var playingPoseInfo=this.getCurrentPoseInfo();
    if(playingPoseInfo!=null){
        return this.pattern() === playingPoseInfo.origin;
    }
    return this.pattern() === 1;
};

Game_CharacterBase.prototype.resetPattern = function() {
    var playingPoseInfo=this.getCurrentPoseInfo();
    if(playingPoseInfo!=null){
        this.setPattern(playingPoseInfo.origin);
    }else{
        this.setPattern(1);
    }
};
