package com.example;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.exceptions.JedisConnectionException;
import java.sql.*;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class Worker {
    public static void main(String[] args) {
        try {
            Jedis redis = connectToRedis("redis");
            Connection dbConn = connectToDB("db");

            System.out.println("Watching vote queue");

            while (true) {
                String voteJSON = redis.blpop(0, "votes").get(1);
                System.out.println("Received: " + voteJSON);
                // Process vote here
                // e.g., insert into database
                // dbConn.createStatement().execute("INSERT INTO votes...");
                
                TimeUnit.MILLISECONDS.sleep(100);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }

    private static Jedis connectToRedis(String host) {
        Jedis conn = null;
        
        while (conn == null) {
            try {
                conn = new Jedis(host);
            } catch (JedisConnectionException e) {
                System.out.println("Waiting for Redis connection...");
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException ie) {}
            }
        }
        
        return conn;
    }

    private static Connection connectToDB(String host) throws SQLException {
        Connection conn = null;
        
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            System.exit(1);
        }

        while (conn == null) {
            try {
                String url = "jdbc:postgresql://" + host + "/postgres";
                conn = DriverManager.getConnection(url, "postgres", "postgres");
            } catch (SQLException e) {
                System.out.println("Waiting for DB connection...");
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException ie) {}
            }
        }
        
        return conn;
    }
}