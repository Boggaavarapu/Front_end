package com.example.WebDemo.ModelController;

import java.util.HashMap;
import java.util.Map.Entry;
import java.util.Set;
import java.util.ArrayList;
import org.json.JSONObject;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import com.example.WebDemo.Model.PassEncTech1;
public class ControllerClass extends AbstractWebSocketHandler {
	private PassEncTech1 ps =new PassEncTech1();
	private final HashMap<String, ArrayList<TextMessage>> onetoone = new HashMap<String, ArrayList<TextMessage>>();
	private final ArrayList<TextMessage> groups = new ArrayList<TextMessage>();
	private final  HashMap<String,WebSocketSession> usernames=new HashMap<String,WebSocketSession>();
	private final ArrayList<WebSocketSession> webSocketSessions = new ArrayList<>();
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        webSocketSessions.add(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session,  TextMessage message) throws Exception 
    {
    	JSONObject json = new JSONObject(message.getPayload());
    	if (((String) json.get("sender1")).equals("server")) 
    	{
    		if(ps.Check((json.get("usernam1")).toString(),(Integer)json.get("uniquecode"))) 
    		{
    			
    			usernames.put(((String) json.get("usernam1")),session);
        		//sending group messages
        		ArrayList<TextMessage> sending_group=groups;
        		for(TextMessage tm:sending_group) {
        			session.sendMessage(tm);
        		}
        		//sending the one to one messages
        		Set<String> keys = onetoone.keySet();
        		for (String key : keys) {
        			String[] arr=key.split(":");
        			if(arr[0].equals(((String) json.get("usernam1")))) {
        				ArrayList<TextMessage> sending_1to1=onetoone.get(key);
        				for(TextMessage tm:sending_1to1) {
        	    			session.sendMessage(tm);
        	    		}
        			}
        			if(arr[1].equals(((String) json.get("usernam1")))) {
        				ArrayList<TextMessage> sending_1to1=onetoone.get(key);
        				for(TextMessage tm:sending_1to1) {
        	    			session.sendMessage(tm);
        	    		}
        			}
        		}
    		}
    		else {
    			session.close();
    		}
    	}
    	else {
    		if (session.equals(usernames.get((String) json.get("usernam1"))))
    		{
    			WebSocketSession check=usernames.get((String) json.get("usernam1"));
    			if (session==check) 
    			{
    	    		if(((String) json.get("sender1")).equals("Group")) {
    	    			groups.add(message);
    	    			for(HashMap.Entry<String, WebSocketSession> entry :usernames.entrySet()) {
    	    				WebSocketSession value = entry.getValue();
    	    				value.sendMessage(message);
    	    			} 
    	    		}
    	    		else {
    	    			if(onetoone.containsKey(((String) json.get("sender1"))+":"+((String) json.get("usernam1")))) {
    	    				ArrayList<TextMessage> ls=new ArrayList<TextMessage>();
    	    				ls.add(message);
    	    				ArrayList<TextMessage> sending_1to1=onetoone.get(((String) json.get("sender1"))+":"+((String) json.get("usernam1")));
    	    				ArrayList<TextMessage> sending_1to1_2=onetoone.get(((String) json.get("sender1"))+":"+((String) json.get("usernam1")));
    	    				sending_1to1.add(message);
    	    				onetoone.put(((String) json.get("sender1"))+":"+((String) json.get("usernam1")),sending_1to1);
    	    				sending_1to1_2.add(message);
    	    				onetoone.put(((String) json.get("sender1"))+":"+((String) json.get("usernam1")),sending_1to1);
    	    				session.sendMessage(message);
    	    				if (usernames.containsKey((String) json.get("sender1"))) {
    	    					WebSocketSession session1=usernames.get((String) json.get("sender1"));
    	            			session1.sendMessage(message);
    	            		}
    	    			}
    	    			else {
    	    				ArrayList<TextMessage> ls=new ArrayList<TextMessage>();
    	    				ls.add(message);
    	    				onetoone.put(((String) json.get("sender1"))+":"+((String) json.get("usernam1")),ls);
    	    				onetoone.put(((String) json.get("sender1"))+":"+((String) json.get("usernam1")),ls);
    	    				session.sendMessage(message);
    	    				if (usernames.containsKey((String) json.get("sender1"))) {
    	    					WebSocketSession session1=usernames.get((String) json.get("sender1"));
    	            			session1.sendMessage(message);
    	            		}
    	    			}
    	    		}
    			}
    			else {
    				session.close();
    			}
    		}
    		else {
    			session.close();
    		}
    	}
    }
	@Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		for(HashMap.Entry<String, WebSocketSession> entry :usernames.entrySet()) {
			WebSocketSession value = entry.getValue();
			if (value.equals(session)) {
				usernames.remove(entry.getKey());
				ps.delete(entry.getKey());
			}
		} 
    	webSocketSessions.remove(session);
    }
}
