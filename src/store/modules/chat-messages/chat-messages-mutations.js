import Vue from 'vue';

export default {

    setChatConversationsCount(context, { publicKey, count } ){

        const conversations = { ...( context.conversations[ publicKey ] || {} )  };

        conversations.count = count;

        Vue.set(context.conversations, publicKey, conversations );

    },

    setChatConversationsIds(context, { publicKey, ids } ){

        const conversations = { ...( context.conversations[ publicKey ] || {} )  };
        if (!conversations.ids) conversations.ids = {};

        for (const id of ids)
            conversations.ids[id] = true;

        Vue.set(context.conversations, publicKey, conversations );

    },


    setChatConversationMessagesCount(context, { publicKey1, publicKey2, count } ){

        const publicKeys = [publicKey1, publicKey2].sort( (a,b) => a.localeCompare(b) );

        const conversationMessages = { ...( context.conversationMessages[ publicKeys[0]+":"+publicKeys[1] ] || {} )  };

        conversationMessages.count = count;

        Vue.set(context.conversationMessages, publicKeys[0]+":"+publicKeys[1], conversationMessages );

    },

    setChatConversationMessagesIds(context, { publicKey1, publicKey2, ids, next } ){

        const publicKeys = [publicKey1, publicKey2].sort( (a,b) => a.localeCompare(b) );

        const conversationMessages = { ...( context.conversationMessages[ publicKeys[0]+":"+publicKeys[1] ] || {} )  };
        if (!conversationMessages.ids) conversationMessages.ids = {};

        for (const id of ids)
            conversationMessages.ids[id] = true;

        if (next !== undefined)
            conversationMessages.next = next;

        Vue.set(context.conversationMessages, publicKeys[0]+":"+publicKeys[1], conversationMessages );

    },

    async setChatEncryptedMessage(context, { encryptedMessage } ){


        const publicKeys = [encryptedMessage.senderPublicKey.toString("hex"), encryptedMessage.receiverPublicKey.toString("hex")].sort( (a,b) => a.localeCompare(b) );

        const conversationMessages = { ...( context.conversationMessages[ publicKeys[0]+":"+publicKeys[1] ] || {} )  };
        if (!conversationMessages.ids) conversationMessages.ids = {};

        const id = encryptedMessage.hash().toString("hex");
        if (!conversationMessages.ids[ id ]){

            conversationMessages.ids[ id ]++;
            conversationMessages.count += 1;

            Vue.set(context.conversationMessages, publicKeys[0]+":"+publicKeys[1], conversationMessages );
        }

        //a new conversation
        for (let i=0; i < publicKeys.length; i++) {
            let conversations = {...( context.conversations[publicKeys[i]] || {} )};
            if (!conversations.ids) conversations.ids = {};

            conversations.ids[ i === 0 ? publicKeys[1] : publicKeys[0] ] = true;

            Vue.set(context.conversations, publicKeys[i], conversations);
        }

        const senderAddress = await PandoraPay.wallet.manager.getWalletAddressByAddress( encryptedMessage.senderAddress );
        if (senderAddress) {
            const data = await encryptedMessage.decryptData(encryptedMessage.senderEncryptedData, senderAddress.decryptPrivateKey() );
            const senderData = await PandoraPay.cryptography.chatMessageValidator.validateChatMessage(data);
            if (senderData)
                encryptedMessage._senderData = senderData;
            console.log(`senderData    #${senderData}#`);
        }

        const receiverAddress = await PandoraPay.wallet.manager.getWalletAddressByAddress( encryptedMessage.receiverAddress );
        if (receiverAddress) {
            const data = await encryptedMessage.decryptData(encryptedMessage.receiverEncryptedData, receiverAddress.decryptPrivateKey() );
            const receiverData = await PandoraPay.cryptography.chatMessageValidator.validateChatMessage(data);
            if (receiverData)
                encryptedMessage._receiverData = receiverData;
            console.log(`senderData    #${receiverData}#`);
        }

        const hash = encryptedMessage.hash().toString("hex");
        Vue.set( context.messages, hash, encryptedMessage );

    },

}